import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import questions from "../data/questions";
import "./Level2.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Level2() {

    const {
        score,
        setScore,
        setCurrentLevel
    } = useContext(GameContext);

    const [timeLeft,setTimeLeft] =
    useState(90);

    const [currentQuestion,
    setCurrentQuestion] =
    useState(null);

    const [playerPos,setPlayerPos] =
    useState({
        x:20,
        y:20
    });

    const [checkpointStatus,
    setCheckpointStatus] =
    useState({});

    const checkpoints = [

        {id:1,x:80,y:80},
        {id:2,x:250,y:100},
        {id:3,x:500,y:120},
        {id:4,x:600,y:250},
        {id:5,x:100,y:300},

        {id:6,x:250,y:400},
        {id:7,x:500,y:450},
        {id:8,x:650,y:550},
        {id:9,x:120,y:600},
        {id:10,x:350,y:600}

    ];

    const navigate = useNavigate();

    useEffect(()=>{

        if(timeLeft <= 0) return;

        const timer = setInterval(()=>{

            setTimeLeft(prev=>prev-1);

        },1000);

        return ()=>clearInterval(timer);

    },[timeLeft]);

    useEffect(()=>{

        const handleMovement = (e)=>{

            const speed = 20;

            setPlayerPos(prev=>{

                let newX = prev.x;
                let newY = prev.y;

                if(e.key === "ArrowUp"){
                    newY -= speed;
                }

                if(e.key === "ArrowDown"){
                    newY += speed;
                }

                if(e.key === "ArrowLeft"){
                    newX -= speed;
                }

                if(e.key === "ArrowRight"){
                    newX += speed;
                }

                newX = Math.max(
                    0,
                    Math.min(660,newX)
                );

                newY = Math.max(
                    0,
                    Math.min(660,newY)
                );

                return {
                    x:newX,
                    y:newY
                };
            });

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

    },[]);

    useEffect(()=>{

        checkpoints.forEach((door)=>{

            const collision =

                Math.abs(
                    playerPos.x-door.x
                ) < 50 &&

                Math.abs(
                    playerPos.y-door.y
                ) < 50;

            if(
                collision &&
                !checkpointStatus[door.id]
            ){

                const randomQuestion =

                questions.level2[
                    Math.floor(
                        Math.random()*
                        questions.level2.length
                    )
                ];

                setCurrentQuestion({

                    ...randomQuestion,

                    doorId:door.id
                });
            }

        });

    },[playerPos]);

    const handleAnswer = (selected)=>{

        if(
            selected ===
            currentQuestion.answer
        ){

            setScore(prev=>prev+20);

            setCheckpointStatus(prev=>({

                ...prev,

                [currentQuestion.doorId]:
                "correct"
            }));

            toast.success(
                "Checkpoint Cleared! +20"
            );
        }

        else{

            setCheckpointStatus(prev=>({

                ...prev,

                [currentQuestion.doorId]:
                "wrong"
            }));

            toast.error("Wrong Answer!");
        }

        setCurrentQuestion(null);
    };

    return (

        <div className="level2-page">

            <div className="level2-topbar">

                <h2>
                    Score : {score}
                </h2>

                <Timer timeLeft={timeLeft} />

            </div>

            <div className="level2-info">

                <h1>
                    MAZE ESCAPE
                </h1>

                <p className="instructions">

                    Use arrow keys to
                    move and clear all
                    checkpoints.

                </p>

            </div>

            <div className="maze-container">

                <div
                    className="player"

                    style={{
                        left:playerPos.x,
                        top:playerPos.y
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
                                left:door.x,
                                top:door.y
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
                Object.keys(
                    checkpointStatus
                ).length === 10 &&

                <div className="game-over">

                    <h1>
                        LEVEL COMPLETE 🔥
                    </h1>

                    <h2>
                        Total Score :
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

            {
                timeLeft <= 0 &&

                <div className="game-over">

                    <h1>
                        TIME OVER ⏳
                    </h1>

                    <h2>
                        Final Score :
                        {score}
                    </h2>

                </div>
            }

        </div>
    );
}

export default Level2;