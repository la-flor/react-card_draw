import './Deck.css';
import Card from './Card';
import axios from 'axios';
import React, { useState, useEffect, useRef  } from 'react';

const BASE_URL = "https://deckofcardsapi.com/api/deck";

const Deck = () => {
    const [deckId, setDeckId] = useState(null);
    const [card, setCard] = useState(false);
    const [cardsRemaining, setCardsRemaining] = useState(52);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerId = useRef(null);

    // gets the initial deck
    useEffect(() => {
        const getDeck = async () => {
            const res = await axios(`${BASE_URL}/new/shuffle/?deck_count=1`);
            setDeckId(res.data.deck_id);
        };
        getDeck();
    }, []);

    function cardLeft() {
        if (cardsRemaining === 0) {
            setAutoDraw(false);
            return alert("Error: no cards remaining!");
        }
    }

    // will draw the next card unless if the deck has no cards left
    async function drawCard() {
        cardLeft();

        try { 
            const res = await axios(`${BASE_URL}/${deckId}/draw/?count=1`);
            setCard(res.data.cards[0]);
            setCardsRemaining(res.data.remaining);
        } catch (err) {
            console.log(err);
        }
    }

    // if autoDraw is true, 1 card will be drawn every second
    useEffect(() => {
        cardLeft();
        
        if (autoDraw && !timerId.current) {
            timerId.current = setInterval(async () => {
                await drawCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerId.current);
            timerId.current = null;
        }
    }, [autoDraw, deckId, setDeckId])

    // will toggle state of autoDraw
    const toggleAutoDraw = () => {
        setAutoDraw(autoDraw => !autoDraw);
    }

    return (
        <div id="Deck-container">
            <div id="Deck-content">
                {card &&
                    <Card card={card}/>
                }
                <br/>
                <button onClick={drawCard}>Draw a Card!</button>
                <button onClick={toggleAutoDraw}>Auto Draw!</button>
            </div>
        </div>
    )
}

export default Deck;