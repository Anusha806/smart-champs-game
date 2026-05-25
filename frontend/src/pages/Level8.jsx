import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import API
from "../services/api";

import "./Level8.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level8() {

    const {

        teamName,
        score,
        setScore,
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

    useEffect(()=>{

        const fetchQuestions =
        async()=>{

            try{

                const response =

                await API.get(

                    `/questions/player/${teamName}/8`
                );

                if(

                    !response.data ||

                    response.data.length === 0

                ){

                    toast.error(

                        "Session Expired"
                    );

                    navigate("/register");

                    return;
                }

                setGameQuestions(
                    response.data
                );
            }

            catch(err){

                console.log(err);

                toast.error(

                    "Failed to load final questions"
                );

                navigate("/register");
            }

            finally{

                setLoading(false);
            }
        };

        if(teamName){

            fetchQuestions();
        }

        else{

            navigate("/register");
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

    if(loading){

        return (

            <div className="loading-page">

                <div className="loader"></div>

                <h1>

                    Loading Final Challenge...

                </h1>

            </div>
        );
    }

    return (

        <div className="level8-page">

            <div className="top-bar">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    {timeLeft}s
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

                            "FINALE COMPLETE"

                            :

                            "TIME OVER"
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

                            const usedTime =

                            150 - timeLeft;

                            setTotalTime(prev=>

                                prev + usedTime
                            );

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