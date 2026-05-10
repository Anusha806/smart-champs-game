import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import questions
from "../data/questions";

import "./Level8.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level8() {

    const {

        score,
        setScore

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

    ] = useState(120);

    const [

        completed,
        setCompleted

    ] = useState(false);

    const [

        gameOver,
        setGameOver

    ] = useState(false);

    const [randomQuestions] =
    useState(()=>{

        return [

            ...questions.level8

        ]

        .sort(()=>

            Math.random()-0.5
        )

        .slice(0,10);
    });

    const currentQuestion =
    randomQuestions[currentIndex] || {};

    useEffect(()=>{

        if(

            timeLeft <= 0 ||
            gameOver

        ) return;

        const timer =
        setInterval(()=>{

            setTimeLeft(prev=>

                prev-1
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

    const handleAnswer =
    (selected)=>{

        if(

            completed ||
            gameOver ||
            timeLeft <= 0

        ) return;

        if(

            selected ===
            currentQuestion.answer

        ){

            setProgress(prev=>

                prev + 1
            );

            setScore(prev=>

                prev + 20
            );

            toast.success(
                "+20 Points"
            );
        }

        else{

            setScore(prev=>

                Math.max(
                    prev - 10,
                    0
                )
            );

            toast.error(
                "-10 Points"
            );
        }

        if(

            currentIndex <
            randomQuestions.length - 1

        ){

            setCurrentIndex(prev=>

                prev + 1
            );
        }

        else{

            setCompleted(true);

            setGameOver(true);
        }
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

                    Question :

                    {

                        Math.min(
                            currentIndex + 1,
                            10
                        )

                    }/10

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
                            `${progress * 9}%`
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

                !completed &&
                timeLeft > 0 &&
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

            {
                gameOver &&

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

                    {

                        completed &&

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
                    }

                </div>
            }

        </div>
    );
}

export default Level8;