import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import Timer
from "../components/Timer";

import QuestionCard
from "../components/QuestionCard";

import level2Questions
from "../data/level2Questions";

import "./Level2.css";

import { useNavigate }
from "react-router-dom";

import toast
from "react-hot-toast";

function Level2() {

    const {
        score,
        setScore,
        setCurrentLevel
    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [
        timeLeft,
        setTimeLeft
    ] = useState(90);

    const [
        currentQuestion,
        setCurrentQuestion
    ] = useState(null);

    const [
        playerPos,
        setPlayerPos
    ] = useState({
        x:20,
        y:20
    });

    const [
        checkpointStatus,
        setCheckpointStatus
    ] = useState({});

    const [
        gameOver,
        setGameOver
    ] = useState(false);

    const checkpoints = [

        {id:1,x:8,y:8},
        {id:2,x:28,y:12},
        {id:3,x:50,y:15},
        {id:4,x:72,y:18},
        {id:5,x:85,y:35},

        {id:6,x:65,y:55},
        {id:7,x:42,y:68},
        {id:8,x:18,y:72},
        {id:9,x:25,y:88},
        {id:10,x:75,y:85}
    ];

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

    const movePlayer =
    (direction)=>{

        if(
            currentQuestion ||
            gameOver
        ) return;

        const speed = 4;

        setPlayerPos(prev=>{

            let newX = prev.x;
            let newY = prev.y;

            if(direction === "up"){
                newY -= speed;
            }

            if(direction === "down"){
                newY += speed;
            }

            if(direction === "left"){
                newX -= speed;
            }

            if(direction === "right"){
                newX += speed;
            }

            newX = Math.max(
                0,
                Math.min(90,newX)
            );

            newY = Math.max(
                0,
                Math.min(90,newY)
            );

            return {
                x:newX,
                y:newY
            };
        });
    };

    useEffect(()=>{

        const handleMovement =
        (e)=>{

            if(e.key === "ArrowUp"){
                movePlayer("up");
            }

            if(e.key === "ArrowDown"){
                movePlayer("down");
            }

            if(e.key === "ArrowLeft"){
                movePlayer("left");
            }

            if(e.key === "ArrowRight"){
                movePlayer("right");
            }
        };

        window.addEventListener(
            "keydown",
            handleMovement
        );

        return ()=>{

            window.removeEventListener(
                "keydown",
                handleMovement
            );
        };

    },[
        currentQuestion,
        gameOver
    ]);

    useEffect(()=>{

        if(
            currentQuestion ||
            gameOver
        ) return;

        checkpoints.forEach((door)=>{

            const collision =

                Math.abs(
                    playerPos.x - door.x
                ) < 6 &&

                Math.abs(
                    playerPos.y - door.y
                ) < 6;

            if(
                collision &&
                !checkpointStatus[
                    door.id
                ]
            ){

                const randomQuestion =

                level2Questions[
                    Math.floor(
                        Math.random() *
                        level2Questions.length
                    )
                ];

                setCurrentQuestion({

                    ...randomQuestion,

                    doorId:door.id
                });
            }

        });

    },[
        playerPos,
        currentQuestion,
        checkpointStatus,
        gameOver
    ]);

    const handleAnswer =
    (selected)=>{

        if(

            selected ===
            currentQuestion.answer

        ){

            setScore(prev=>

                prev + 10
            );

            setCheckpointStatus(prev=>({

                ...prev,

                [currentQuestion.doorId]:
                "correct"
            }));

            toast.success(
                "Checkpoint Cleared! +10"
            );
        }

        else{

            setCheckpointStatus(prev=>({

                ...prev,

                [currentQuestion.doorId]:
                "wrong"
            }));

            toast.error(
                "Wrong Answer!"
            );
        }

        setCurrentQuestion(null);
    };

    const completed =

    Object.keys(
        checkpointStatus
    ).length === 10;

    useEffect(()=>{

        if(completed){

            setGameOver(true);
        }

    },[completed]);

    return (

        <div className="level2-page">

            <div className="level2-topbar">

                <h2>
                    Score : {score}
                </h2>

                <Timer
                    timeLeft={timeLeft}
                />

            </div>

            <div className="level2-info">

                <h1>
                    MAZE ESCAPE
                </h1>

                <p className="instructions">

                    Use arrow keys or
                    mobile controls to
                    move and clear all
                    checkpoints.

                </p>

            </div>

            <div className="maze-container">

                <div
                    className="player"

                    style={{

                        left:`${playerPos.x}%`,
                        top:`${playerPos.y}%`
                    }}
                ></div>

                {

                    checkpoints.map((door)=>(

                        <div
                            key={door.id}

                            className={`

                                door

                                ${
                                    checkpointStatus[
                                        door.id
                                    ] === "correct"

                                    ?

                                    "completed-door"

                                    :

                                    ""
                                }

                                ${
                                    checkpointStatus[
                                        door.id
                                    ] === "wrong"

                                    ?

                                    "wrong-door"

                                    :

                                    ""
                                }
                            `}

                            style={{

                                left:`${door.x}%`,
                                top:`${door.y}%`
                            }}
                        >

                            {

                                checkpointStatus[
                                    door.id
                                ] === "correct"

                                ?

                                "✓"

                                :

                                checkpointStatus[
                                    door.id
                                ] === "wrong"

                                ?

                                "✗"

                                :

                                "📍"
                            }

                        </div>
                    ))
                }

            </div>

            <div className="mobile-controls">

                <button
                    onClick={()=>movePlayer("up")}
                >
                    ⬆
                </button>

                <div>

                    <button
                        onClick={()=>movePlayer("left")}
                    >
                        ⬅
                    </button>

                    <button
                        onClick={()=>movePlayer("down")}
                    >
                        ⬇
                    </button>

                    <button
                        onClick={()=>movePlayer("right")}
                    >
                        ➡
                    </button>

                </div>

            </div>

            {

                currentQuestion &&

                <QuestionCard

                    currentQuestion={
                        currentQuestion
                    }

                    handleAnswer={
                        handleAnswer
                    }
                />
            }

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

                            "LEVEL COMPLETE 🔥"

                            :

                            "TIME OVER ⏳"
                        }

                    </h1>

                    <h2>

                        Final Score :
                        {score}

                    </h2>

                    <button

                        className="next-btn"

                        onClick={()=>{

                            setCurrentLevel(3);

                            navigate("/level3");
                        }}
                    >

                        NEXT LEVEL

                    </button>

                </div>
            }

        </div>
    );
}

export default Level2;