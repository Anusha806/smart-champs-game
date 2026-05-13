import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import API
from "../services/api";

import "./Level7.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level7() {

    const {

        teamName,
        score,
        setScore,
        setCurrentLevel,
        setWarnings,
        setTotalTime

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [

        gameQuestions,
        setGameQuestions

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);

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

    const [

        solvedQuestions,
        setSolvedQuestions

    ] = useState([]);

    const [

        answeredQuestions,
        setAnsweredQuestions

    ] = useState([]);

    useEffect(()=>{

        const fetchQuestions =
        async()=>{

            try{

                const response =

                await API.get(

                    `/questions/player/${teamName}/7`
                );

                setGameQuestions(
                    response.data
                );
            }

            catch(err){

                console.log(err);

                toast.error(

                    "Failed to load logic questions"
                );
            }

            finally{

                setLoading(false);
            }
        };

        if(teamName){

            fetchQuestions();
        }

    },[teamName]);

    const currentQuestion =
    gameQuestions[currentIndex] || {};

    useEffect(()=>{

        if(
            timeLeft <= 0 ||
            gameOver ||
            completed
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
        gameOver,
        completed
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

            &&

            gameQuestions.length > 0

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

    const normalize =
    (text)=>{

        return text

        ?.replace(/^[A-D]\)\s*/,"")

        .trim()
        .toLowerCase();
    };

    const handleAnswer =
    (selected)=>{

        if(

            gameOver ||
            completed ||
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

        const selectedAnswer =

        normalize(selected);

        const correctAnswer =

        normalize(
            currentQuestion.answer
        );

        if(

            selectedAnswer ===
            correctAnswer

        ){

            const newStreak =
            streak + 1;

            setStreak(
                newStreak
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

            setStreak(0);

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

    if(loading){

        return (

            <div className="loading-page">

                <div className="loader"></div>

                <h1>

                    Loading Logic Reactor...

                </h1>

            </div>
        );
    }

    return (

        <div className="level7-page">

            <div className="top-bar">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    {timeLeft}s
                </h2>

                <h2>
                    Streak : {streak}
                </h2>

            </div>

            <h1>
                LOGIC REACTOR
            </h1>

            {

                !gameOver &&
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

                                "✓"

                                :

                                answeredQuestions
                                .includes(index)

                                ?

                                "✗"

                                :

                                index + 1
                            }

                        </button>
                    ))
                }

            </div>

            <div className="progress">

                Answered :

                {

                    answeredQuestions.length

                }

                /

                {gameQuestions.length}

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

                            "LEVEL COMPLETE"

                            :

                            "TIME OVER"
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

                            const usedTime =

                            180 - timeLeft;

                            setTotalTime(prev=>

                                prev + usedTime
                            );

                            setCurrentLevel(8);

                            navigate(
                                "/level8"
                            );
                        }}
                    >

                        FINAL LEVEL

                    </button>

                </div>
            }

        </div>
    );
}

export default Level7;