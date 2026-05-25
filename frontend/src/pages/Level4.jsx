import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import API
from "../services/api";

import "./Level4.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level4() {

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

    useEffect(()=>{

        const fetchQuestions =
        async()=>{

            try{

                const response =

                await API.get(

                    `/questions/player/${teamName}/4`
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

                    "Failed to load crossword questions"
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

    const currentPuzzle =
    gameQuestions[currentIndex] || {};

    useEffect(()=>{

        if(
            timeLeft <= 0 ||
            gameOver ||
            levelComplete
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
        levelComplete
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

            &&

            gameQuestions.length > 0

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

    const normalize =
    (text)=>{

        return text

        ?.trim()
        .replace(/\s+/g,"")
        .toUpperCase();
    };

    const handleSubmit = ()=>{

        if(
            timeLeft <= 0 ||
            gameOver
        ) return;

        const currentInput =

        answers[currentIndex]
        || "";

        const userAnswer =

        normalize(currentInput);

        const correctAnswer =

        normalize(
            currentPuzzle.answer
        );

        if(userAnswer === correctAnswer){

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

    if(loading){

        return (

            <div className="loading-page">

                <div className="loader"></div>

                <h1>

                    Loading Crossword...

                </h1>

            </div>
        );
    }

    return (

        <div className="level4-page">

            <h1>
                CROSSWORD ARENA
            </h1>

            <h2>
                Score : {score}
            </h2>

            <h2>
                {timeLeft}s
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

                                "✓"

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

                            "LEVEL COMPLETE"

                            :

                            "TIME OVER"
                        }

                    </h1>

                    <h2>

                        Total Score :
                        {score}

                    </h2>

                    <button

                        className="next-btn"

                        onClick={()=>{

                            const usedTime =

                            90 - timeLeft;

                            setTotalTime(prev=>

                                prev + usedTime
                            );

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