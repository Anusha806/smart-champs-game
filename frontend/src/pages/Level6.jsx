import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import "./Level6.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level6() {

    const {

        score,
        setScore,
        setCurrentLevel,
        setWarnings

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const symbols = [

        "⚡","🔥","🎯","🚀",
        "🧠","🏆","💎","🌟",
        "🎮","👑",

        "⚡","🔥","🎯","🚀",
        "🧠","🏆","💎","🌟",
        "🎮","👑"
    ];

    const [cards,setCards] =
    useState([]);

    const [flipped,setFlipped] =
    useState([]);

    const [matched,setMatched] =
    useState([]);

    const [disabled,setDisabled] =
    useState(false);

    const [timeLeft,setTimeLeft] =
    useState(120);

    const [gameOver,setGameOver] =
    useState(false);

    const [levelComplete,
    setLevelComplete] =
    useState(false);

    useEffect(()=>{

        const shuffled =

        [...symbols]
        .sort(()=>Math.random()-0.5);

        setCards(shuffled);

    },[]);

    useEffect(()=>{

        if(
            timeLeft <= 0 ||
            gameOver
        ) return;

        const timer =
        setInterval(()=>{

            setTimeLeft(prev=>

                prev - 1
            );

        },1000);

        return ()=>clearInterval(timer);

    },[
        timeLeft,
        gameOver
    ]);

    useEffect(()=>{

        if(timeLeft <= 0){

            setCurrentLevel(7);

            setGameOver(true);
        }

    },[timeLeft]);

    useEffect(()=>{

        const handleVisibility =
        ()=>{

            if(document.hidden){

                setWarnings(prev=>

                    prev + 1
                );

                toast.error(
                    "Tab switch detected!"
                );
            }
        };

        document.addEventListener(

            "visibilitychange",

            handleVisibility
        );

        return ()=>{

            document.removeEventListener(

                "visibilitychange",

                handleVisibility
            );
        };

    },[]);

    useEffect(()=>{

        if(flipped.length === 2){

            setDisabled(true);

            const first =
            cards[flipped[0]];

            const second =
            cards[flipped[1]];

            if(first === second){

                setMatched(prev=>[

                    ...prev,
                    ...flipped

                ]);

                setScore(prev=>

                    prev + 30
                );

                toast.success(
                    "Matched! +30"
                );

                setFlipped([]);

                setDisabled(false);
            }

            else{

                setTimeout(()=>{

                    setFlipped([]);

                    setDisabled(false);

                },800);
            }
        }

    },[flipped]);

    const handleFlip =
    (index)=>{

        if(

            disabled ||

            flipped.includes(index) ||

            matched.includes(index) ||

            gameOver ||

            timeLeft <= 0

        ) return;

        setFlipped(prev=>[

            ...prev,
            index

        ]);
    };

    const completed =

    cards.length > 0 &&

    matched.length ===
    cards.length;

    useEffect(()=>{

        if(completed){

            setCurrentLevel(7);

            setLevelComplete(true);

            setGameOver(true);
        }

    },[completed]);

    return (

        <div className="level6-page">

            <div className="top-bar">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    ⏳ {timeLeft}s
                </h2>

            </div>

            <h1>
                MEMORY GRID RUSH
            </h1>

            <p className="instruction">

                Match all hidden
                symbol pairs.

            </p>

            <div className="memory-grid">

                {
                    cards.map((card,index)=>(

                        <div
                            key={index}

                            className={`

                                memory-card

                                ${
                                    flipped.includes(index)

                                    ||

                                    matched.includes(index)

                                    ?

                                    "show-card"

                                    :

                                    ""
                                }
                            `}

                            onClick={()=>{

                                handleFlip(index);
                            }}
                        >

                            {

                                flipped.includes(index)

                                ||

                                matched.includes(index)

                                ?

                                card

                                :

                                "?"
                            }

                        </div>
                    ))
                }

            </div>

            {
                gameOver &&

                <div className="game-over">

                    <h1>

                        {

                            levelComplete

                            ?

                            "LEVEL COMPLETE 🏆"

                            :

                            "TIME OVER ⏳"
                        }

                    </h1>

                    <h2>

                        Final Score :
                        {score}

                    </h2>

                    <button

                        className=
                        "next-btn"

                        onClick={()=>{

                            navigate(
                                "/level7"
                            );
                        }}
                    >

                        NEXT LEVEL

                    </button>

                </div>
            }

        </div>
    );
}

export default Level6;