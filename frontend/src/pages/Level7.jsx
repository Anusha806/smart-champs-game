import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import questions
from "../data/questions";

import "./Level7.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level7() {

    const {

        score,
        setScore,
        setCurrentLevel

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [

        currentIndex,
        setCurrentIndex

    ] = useState(0);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(180);

    const [streak,setStreak] =
    useState(0);

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

            ...questions.level7

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

            gameOver ||
            completed ||
            timeLeft <= 0

        ) return;

        if(

            selected ===
            currentQuestion.answer

        ){

            const newStreak =
            streak + 1;

            setStreak(
                newStreak
            );

            let points = 30;

            if(newStreak >= 3){

                points += 15;

                toast.success(
                    "Logic Combo Bonus 🔥"
                );
            }

            setScore(prev=>

                prev + points
            );

            toast.success(

                `+${points} Points`
            );
        }

        else{

            setStreak(0);

            toast.error(
                "Wrong Answer"
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

        <div className="level7-page">

            <div className="top-bar">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    ⏳ {timeLeft}s
                </h2>

                <h2>
                    Streak : {streak}
                </h2>

            </div>

            <h1>
                LOGIC REACTOR
            </h1>

            {

                !completed &&
                timeLeft > 0 &&
                currentQuestion.question &&

                <div className="logic-card">

                    <h2>

                        {
                            currentQuestion
                            .question
                        }

                    </h2>

                    <div className="logic-options">

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

                            "LEVEL COMPLETE 🏆"

                            :

                            "TIME OVER ⏳"
                        }

                    </h1>

                    <h2>

                        Final Score :
                        {score}

                    </h2>

                    {

                        completed &&

                        <button

                            className=
                            "next-btn"

                            onClick={()=>{

                                setCurrentLevel(8);

                                navigate(
                                    "/level8"
                                );
                            }}
                        >

                            FINAL LEVEL

                        </button>
                    }

                </div>
            }

        </div>
    );
}

export default Level7;