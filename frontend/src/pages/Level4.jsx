import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import level4Questions
from "../data/level4Questions";

import "./Level4.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level4() {

    const {

        score,
        setScore,
        setCurrentLevel,
        setWarnings

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [gameQuestions] =
    useState(()=>{

        return [

            ...level4Questions

        ]

        .sort(()=>

            Math.random() - 0.5
        )

        .slice(0,10);
    });

    const [

        currentIndex,
        setCurrentIndex

    ] = useState(0);

    const [

        answers,
        setAnswers

    ] = useState({});

    const [

        solvedQuestions,
        setSolvedQuestions

    ] = useState([]);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(90);

    const [

        gameOver,
        setGameOver

    ] = useState(false);

    const [

        levelComplete,
        setLevelComplete

    ] = useState(false);

    const currentPuzzle =
    gameQuestions[currentIndex] || {};

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

            setGameOver(true);
        }

    },[timeLeft]);

    useEffect(()=>{

        if(

            solvedQuestions.length ===
            gameQuestions.length

        ){

            setLevelComplete(true);

            setGameOver(true);
        }

    },[
        solvedQuestions,
        gameQuestions
    ]);

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

    const handleSubmit = ()=>{

        if(
            timeLeft <= 0 ||
            gameOver
        ) return;

        const currentInput =

        answers[currentIndex]
        || "";

        if(

            currentInput
            .trim()
            .toUpperCase()

            ===

            currentPuzzle
            .answer
            ?.trim()
            .toUpperCase()

        ){

            if(

                solvedQuestions.includes(
                    currentIndex
                )
            ) return;

            setScore(prev=>

                prev + 10
            );

            const updatedSolved = [

                ...solvedQuestions,
                currentIndex
            ];

            setSolvedQuestions(
                updatedSolved
            );

            toast.success(
                "+10 Points"
            );

            setTimeout(()=>{

                const nextQuestion =

                gameQuestions.findIndex(
                    (_,index)=>

                        !updatedSolved.includes(
                            index
                        )
                );

                if(nextQuestion !== -1){

                    setCurrentIndex(
                        nextQuestion
                    );
                }

            },700);
        }

        else{

            toast.error(
                "Wrong Answer"
            );
        }
    };

    return (

        <div className="level4-page">

            <h1>
                CROSSWORD ARENA
            </h1>

            <h2>
                Score : {score}
            </h2>

            <h2>
                ⏳ {timeLeft}s
            </h2>

            {

                !gameOver &&

                <div className="crossword-card">

                    <h3>

                        Clue :

                        {
                            currentPuzzle.clue
                        }

                    </h3>

                    <div className="word-grid">

                        {

                            currentPuzzle.answer
                            ?.split("")
                            .map((letter,index)=>(

                                <div
                                    key={index}

                                    className=
                                    "letter-box"
                                >

                                    {

                                        answers[
                                            currentIndex
                                        ]

                                        ?

                                        answers[
                                            currentIndex
                                        ][index]
                                        ?.toUpperCase()

                                        :

                                        ""
                                    }

                                </div>
                            ))
                        }

                    </div>

                    <input
                        type="text"

                        placeholder=
                        "Type Answer"

                        value={

                            answers[
                                currentIndex
                            ] || ""
                        }

                        disabled={gameOver}

                        onChange={(e)=>{

                            setAnswers(prev=>({

                                ...prev,

                                [currentIndex]:
                                e.target.value
                            }));
                        }}
                    />

                    <button
                        onClick={handleSubmit}

                        disabled={gameOver}
                    >

                        SUBMIT

                    </button>

                </div>
            }

            <div className="progress">

                Solved :

                {

                    solvedQuestions.length

                }

                /

                {gameQuestions.length}

            </div>

            <div
                className="question-selector"
            >

                {

                    gameQuestions.map(
                    (_,index)=>(

                        <button
                            key={index}

                            className={`

                                selector-btn

                                ${
                                    currentIndex
                                    === index

                                    ?

                                    "active-selector"

                                    :

                                    ""
                                }

                                ${
                                    solvedQuestions
                                    .includes(index)

                                    ?

                                    "solved-selector"

                                    :

                                    ""
                                }
                            `}

                            onClick={()=>{

                                setCurrentIndex(
                                    index
                                );
                            }}
                        >

                            {

                                solvedQuestions
                                .includes(index)

                                ?

                                "✅"

                                :

                                index + 1
                            }

                        </button>
                    ))
                }

            </div>

            {

                (
                    gameOver ||
                    timeLeft <= 0
                )

                &&

                <div className="game-over">

                    <h1>

                        {

                            levelComplete

                            ?

                            "LEVEL COMPLETE 🔥"

                            :

                            "TIME OVER ⏳"
                        }

                    </h1>

                    <h2>

                        Total Score :
                        {score}

                    </h2>

                    <button

                        className="next-btn"

                        onClick={()=>{

                            setCurrentLevel(5);

                            navigate(
                                "/level5"
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

export default Level4;