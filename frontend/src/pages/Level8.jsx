import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import level8Questions
from "../data/level8Questions";

import "./Level8.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level8() {

    const {

        score,
        setScore,
        setWarnings

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [progress,setProgress] =
    useState(0);

    const [

        currentIndex,
        setCurrentIndex

    ] = useState(0);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(150);

    const [

        completed,
        setCompleted

    ] = useState(false);

    const [

        gameOver,
        setGameOver

    ] = useState(false);

    const [

        answeredQuestions,
        setAnsweredQuestions

    ] = useState([]);

    const [

        solvedQuestions,
        setSolvedQuestions

    ] = useState([]);

    const [gameQuestions] =
    useState(()=>{

        return [

            ...level8Questions

        ]

        .sort(()=>

            Math.random() - 0.5
        )

        .slice(0,15);
    });

    const currentQuestion =
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

            answeredQuestions.length ===
            gameQuestions.length

        ){

            setCompleted(true);

            setGameOver(true);
        }

    },[
        answeredQuestions,
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

    const handleAnswer =
    (selected)=>{

        if(

            completed ||
            gameOver ||
            timeLeft <= 0

        ) return;

        if(

            answeredQuestions.includes(
                currentIndex
            )
        ){

            toast.error(
                "Already Answered"
            );

            return;
        }

        let updatedSolved =

        [...solvedQuestions];

        if(

            selected ===
            currentQuestion.answer

        ){

            setProgress(prev=>

                prev + 1
            );

            setScore(prev=>

                prev + 10
            );

            updatedSolved = [

                ...solvedQuestions,
                currentIndex
            ];

            setSolvedQuestions(
                updatedSolved
            );

            toast.success(
                "+10 Points"
            );
        }

        else{

            toast.error(
                "Wrong Answer"
            );
        }

        const updatedAnswered = [

            ...answeredQuestions,
            currentIndex
        ];

        setAnsweredQuestions(
            updatedAnswered
        );

        setTimeout(()=>{

            const nextQuestion =

            gameQuestions.findIndex(
                (_,index)=>

                    !updatedAnswered
                    .includes(index)
            );

            if(nextQuestion !== -1){

                setCurrentIndex(
                    nextQuestion
                );
            }

        },500);
    };

    return (

        <div className="level8-page">

            <div className="top-bar">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    ⏳ {timeLeft}s
                </h2>

                <h2>

                    Answered :

                    {

                        answeredQuestions.length

                    }

                    /

                    {gameQuestions.length}

                </h2>

            </div>

            <h1>
                TROPHY PATH FINALE
            </h1>

            <div className="track-container">

                <div className="track">

                    <div

                        className="runner"

                        style={{

                            left:
                            `${progress * 6}%`
                        }}
                    >

                        🚀

                    </div>

                    <div className="trophy">

                        🏆

                    </div>

                </div>

            </div>

            {

                !gameOver &&
                currentQuestion.question &&

                <div className="question-box">

                    <h2>

                        {
                            currentQuestion
                            .question
                        }

                    </h2>

                    <div className="options">

                        {

                            currentQuestion
                            .options
                            ?.map((option,index)=>(

                                <button
                                    key={index}

                                    disabled={
                                        answeredQuestions
                                        .includes(
                                            currentIndex
                                        )
                                    }

                                    onClick={()=>{

                                        handleAnswer(
                                            option
                                        );
                                    }}
                                >

                                    {option}

                                </button>
                            ))
                        }

                    </div>

                </div>
            }

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

                                    answeredQuestions
                                    .includes(index)

                                    ?

                                    "wrong-selector"

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

                                answeredQuestions
                                .includes(index)

                                ?

                                "❌"

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

                            completed

                            ?

                            "FINALE COMPLETE 🏆"

                            :

                            "TIME OVER ⏳"
                        }

                    </h1>

                    <h2>

                        FINAL SCORE :
                        {score}

                    </h2>

                    <button

                        className=
                        "next-btn"

                        onClick={()=>{

                            navigate(
                                "/result"
                            );
                        }}
                    >

                        VIEW RESULTS

                    </button>

                </div>
            }

        </div>
    );
}

export default Level8;