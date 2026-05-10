import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext";
import toast from "react-hot-toast";
import questions from "../data/questions";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import "./Level1.css";
import { useNavigate } from "react-router-dom";

function Level1() {
    const {
    teamName,
    score,
    setScore,
    setWarnings,
    setCurrentLevel
    } = useContext(GameContext);

    const [timeLeft, setTimeLeft] = useState(60);

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [completedBlocks,setCompletedBlocks] = useState(0);

    const [streak,setStreak] = useState(0);

    const [feedback,setFeedback] = useState("");

    const subjects = [
    {name:"maths",color:"#EF4444"},
    {name:"science",color:"#22C55E"},
    {name:"geography",color:"#3B82F6"},
    {name:"literature",color:"#A855F7"},
    {name:"history",color:"#F59E0B"}
];

    const generateBlocks = ()=>{

        let temp = [];

        subjects.forEach((subject)=>{

            for(let i=0;i<5;i++){

                temp.push({
                    ...subject,
                    id:crypto.randomUUID(),
                    opened:false
                });

            }

        });

        temp.sort(()=>Math.random()-0.5);

        return temp;
    };

    const [blocks,setBlocks] = useState(generateBlocks());

    useEffect(()=>{

        if(timeLeft <= 0) return;

        const timer = setInterval(()=>{
            setTimeLeft(prev=>prev-1);
        },1000);

        return ()=>clearInterval(timer);

    },[timeLeft]);
const navigate = useNavigate();
    useEffect(()=>{
        
        const handleVisibility = ()=>{

            if(document.hidden){

                setWarnings(prev=>prev+1);

                toast.error("Warning! Tab switching detected!");

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

    const handleBlockClick = (block)=>{

    if(block.opened) return;

    const updatedBlocks = blocks.map((b)=>
        b.id === block.id
        ? {...b,opened:true}
        : b
    );

    setBlocks(updatedBlocks);

    setCompletedBlocks(prev=>prev+1);

    const categoryQuestions =
    questions.level1[block.name];

    const randomQuestion =
    categoryQuestions[
        Math.floor(
            Math.random()*
            categoryQuestions.length
        )
    ];

    setCurrentQuestion(randomQuestion);
};

    const handleAnswer = (selected)=>{

        if(selected === currentQuestion.answer){
            let points = 10;
            const newStreak = streak + 1;
            setStreak(newStreak);
            if(newStreak >= 3){
                points += 5;
                toast.success("Combo Bonus +5 🔥");
            }
            setScore(prev=>prev+points);
            setFeedback("correct");
            toast.success(`Correct! +${points} points`);
        }

        else{
            setStreak(0);
            setFeedback("wrong");
            toast.error("Wrong Answer!");
        }

        setTimeout(()=>{
            setFeedback("");
        },500);

        setCurrentQuestion(null);
    };

    return (
        <div className={`level1-page ${feedback}`}>

            <div className="top-bar">
            <div className="stats-panel">

                <div className="stat-box">
                    Blocks Opened : {completedBlocks}/25
                </div>

                <div className="stat-box">
                    Current Streak : {streak}
                </div>

            </div>
            <div className="progress-container">

                <div
                    className="progress-fill"
                    style={{
                        width:`${(completedBlocks/25)*100}%`
                    }}
                ></div>

            </div>


                <h2>{teamName}</h2>

                <Timer timeLeft={timeLeft} />

                <h2>Score : {score}</h2>

            </div>

            <h1>COLOR SMASH QUIZ</h1>

            <p className="instruction">
                Click a color block to receive a challenge question.
            </p>

            <div className="blocks-container">

                {
                    blocks.map((block,index)=>(

                        <div
                            key={block.id}
                            className={`color-block ${block.opened ? "opened" : ""}`}
                            style={{
                                background:block.opened
                                ? "#1E293B"
                                : block.color
                            }}
                            onClick={()=>handleBlockClick(block)}
                        >

                            {
                                block.opened
                                ? "✓"
                                : block.name
                            }

                        </div>

                    ))
                }

            </div>

            {
                currentQuestion &&
                <QuestionCard
                    currentQuestion={currentQuestion}
                    handleAnswer={handleAnswer}
                />
            }

            {
                (timeLeft <= 0 ||
                completedBlocks === 25) &&

                <div className="game-over">

                    <h1>
                        LEVEL COMPLETE
                    </h1>

                    <h2>
                        Final Score : {score}
                    </h2>

                    <h3>
                        Blocks Completed :
                        {completedBlocks}/25
                    </h3>

                    <h3>
                        Best Streak : {streak}
                    </h3>

                    <button
                        className="next-btn"

                        onClick={()=>{

                            setCurrentLevel(2);

                            navigate("/level2");
                        }}
                    >

                        NEXT LEVEL

                    </button>

                </div>
            }

        </div>
    );


}

export default Level1;