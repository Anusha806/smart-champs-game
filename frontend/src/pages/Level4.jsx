import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import questions
from "../data/questions";

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

    const [

        currentIndex,
        setCurrentIndex

    ] = useState(0);

    const [input,setInput] =
    useState("");

    const [

        completed,
        setCompleted

    ] = useState(0);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(75);

    const currentPuzzle =
    questions.level4[currentIndex] || {};

    useEffect(()=>{

        if(timeLeft <= 0) return;

        const timer =
        setInterval(()=>{

            setTimeLeft(prev=>

                prev - 1
            );

        },1000);

        return ()=>clearInterval(timer);

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

    const handleSubmit = ()=>{

        if(timeLeft <= 0) return;

        if(

            input
            .trim()
            .toUpperCase()

            ===

            currentPuzzle
            .answer
            ?.trim()
            .toUpperCase()

        ){

            setScore(prev=>

                prev + 25
            );

            toast.success(
                "+25 Points"
            );
        }

        else{

            toast.error(
                "Wrong Answer"
            );
        }

        setCompleted(prev=>

            prev + 1
        );

        setInput("");

        if(

            currentIndex <
            questions.level4.length - 1

        ){

            setCurrentIndex(prev=>

                prev + 1
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
                timeLeft > 0 &&

                <div className="crossword-card">

                    <h3>

                        Clue :

                        {currentPuzzle.clue}

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

                                        input[index]

                                        ?

                                        input[index]
                                        .toUpperCase()

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

                        value={input}

                        onChange={(e)=>

                            setInput(
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={handleSubmit}
                    >

                        SUBMIT

                    </button>

                </div>
            }

            <div className="progress">

                Puzzle {

                    Math.min(

                        completed + 1,

                        questions.level4.length

                    )

                }/

                {questions.level4.length}

            </div>

            {
                (
                    completed ===
                    questions.level4.length

                    ||

                    timeLeft <= 0
                )

                &&

                <div className="game-over">

                    <h1>

                        {

                            timeLeft <= 0

                            ?

                            "TIME OVER ⏳"

                            :

                            "LEVEL COMPLETE 🔥"
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