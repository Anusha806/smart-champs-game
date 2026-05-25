import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import toast
from "react-hot-toast";

import Timer
from "../components/Timer";

import QuestionCard
from "../components/QuestionCard";

import API
from "../services/api";

import "./Level1.css";

import { useNavigate }
from "react-router-dom";

function Level1() {

    const {

        teamName,
        score,
        setScore,
        setWarnings,
        setCurrentLevel,
        setTotalTime

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [

        questions,
        setQuestions

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);

    const [

        usedQuestions,
        setUsedQuestions

    ] = useState([]);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(60);

    const [

        currentQuestion,
        setCurrentQuestion

    ] = useState(null);

    const [

        activeBlock,
        setActiveBlock

    ] = useState(null);

    const [

        completedBlocks,
        setCompletedBlocks

    ] = useState(0);

    const [

        streak,
        setStreak

    ] = useState(0);

    const [

        feedback,
        setFeedback

    ] = useState("");

    const subjects = [

        {
            name:"maths",
            color:"#EF4444"
        },

        {
            name:"science",
            color:"#22C55E"
        },

        {
            name:"geography",
            color:"#3B82F6"
        },

        {
            name:"literature",
            color:"#A855F7"
        },

        {
            name:"history",
            color:"#F59E0B"
        }
    ];

    const generateBlocks = ()=>{

        let temp = [];

        subjects.forEach((subject)=>{

            for(let i=0;i<5;i++){

                temp.push({

                    ...subject,

                    id:`${subject.name}-${i}`,

                    opened:false
                });
            }
        });

        return temp.sort(()=>

            Math.random() - 0.5
        );
    };

    const [

        blocks,
        setBlocks

    ] = useState(generateBlocks);

    useEffect(()=>{

        const fetchQuestions =
        async()=>{

            try{

                const response =

                await API.get(

                    `/questions/player/${teamName}/1`
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

                setQuestions(
                    response.data
                );
            }

            catch(err){

                console.log(err);

                toast.error(

                    "Failed to load questions"
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

    useEffect(()=>{

        if(

            timeLeft <= 0 ||

            completedBlocks === 25

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
        completedBlocks
    ]);

    useEffect(()=>{

        const handleVisibility =
        ()=>{

            if(document.hidden){

                setWarnings(prev=>

                    prev + 1
                );

                toast.error(

                    "Tab switching detected!"
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

    const handleBlockClick =
    (block)=>{

        if(

            block.opened ||

            currentQuestion ||

            timeLeft <= 0

        ) return;

        const categoryQuestions =

        questions.filter((q)=>

            q.subject?.toLowerCase()

            ===

            block.name.toLowerCase()
        );

        if(

            !categoryQuestions ||

            categoryQuestions.length === 0

        ){

            toast.error(

                `No questions found for ${block.name}`
            );

            return;
        }

        const availableQuestions =

        categoryQuestions.filter((q)=>

            !usedQuestions.includes(
                q.question
            )
        );

        if(
            availableQuestions.length === 0
        ){

            toast.error(

                `No more questions in ${block.name}`
            );

            return;
        }

        const randomQuestion =

        availableQuestions[

            Math.floor(

                Math.random()

                *

                availableQuestions.length
            )
        ];

        setUsedQuestions(prev=>[

            ...prev,

            randomQuestion.question
        ]);

        setActiveBlock(block);

        setCurrentQuestion(
            randomQuestion
        );
    };

    const normalize =
    (text)=>{

        return text

        ?.replace(/^[A-D]\)\s*/,"")

        .trim()
        .toLowerCase();
    };

    const handleAnswer =
    (selected)=>{

        if(!currentQuestion)
        return;

        const correctAnswer =

        normalize(
            currentQuestion.answer
        );

        const selectedAnswer =

        normalize(selected);

        if(
            selectedAnswer ===
            correctAnswer
        ){

            setStreak(prev=>

                prev + 1
            );

            setScore(prev=>

                prev + 10
            );

            setFeedback(
                "correct"
            );

            toast.success(
                "Correct! +10"
            );
        }

        else{

            setStreak(0);

            setFeedback(
                "wrong"
            );

            toast.error(
                "Wrong Answer"
            );
        }

        if(activeBlock){

            setBlocks(prev=>

                prev.map((block)=>

                    block.id === activeBlock.id

                    ?

                    {
                        ...block,
                        opened:true
                    }

                    :

                    block
                )
            );

            setCompletedBlocks(prev=>

                prev + 1
            );
        }

        setTimeout(()=>{

            setFeedback("");

        },500);

        setCurrentQuestion(null);

        setActiveBlock(null);
    };

    if(loading){

        return (

            <div className="loading-page">

                <div className="loader"></div>

                <h1>

                    Loading Questions...

                </h1>

            </div>
        );
    }

    return (

        <div
            className={`
                level1-page
                ${feedback}
            `}
        >

            <div className="top-bar">

                <div className="stats-panel">

                    <div className="stat-box">

                        Blocks Opened :
                        {completedBlocks}/25

                    </div>

                    <div className="stat-box">

                        Streak : {streak}

                    </div>

                </div>

                <div
                    className=
                    "progress-container"
                >

                    <div

                        className=
                        "progress-fill"

                        style={{

                            width:
                            `${(completedBlocks/25)*100}%`
                        }}

                    ></div>

                </div>

                <h2>
                    {teamName}
                </h2>

                <Timer
                    timeLeft={timeLeft}
                />

                <h2>
                    Score : {score}
                </h2>

            </div>

            <h1>
                COLOR SMASH QUIZ
            </h1>

            <p className="instruction">

                Click on any block
                to answer a question.

            </p>

            <div
                className=
                "blocks-container"
            >

                {

                    blocks.map((block)=>(

                        <div
                            key={block.id}

                            className={`

                                color-block

                                ${
                                    block.opened

                                    ?

                                    "opened"

                                    :

                                    ""
                                }
                            `}

                            style={{

                                background:

                                block.opened

                                ?

                                "#1E293B"

                                :

                                block.color
                            }}

                            onClick={()=>{

                                handleBlockClick(
                                    block
                                );
                            }}
                        >

                            {

                                block.opened

                                ?

                                "✓"

                                :

                                block.name
                            }

                        </div>
                    ))
                }

            </div>

            {

                currentQuestion &&

                <QuestionCard

                    currentQuestion=
                    {currentQuestion}

                    handleAnswer=
                    {handleAnswer}

                />
            }

            {

                (
                    timeLeft <= 0 ||
                    completedBlocks === 25
                )

                &&

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

                    <button

                        className=
                        "next-btn"

                        onClick={()=>{

                            const usedTime =

                            60 - timeLeft;

                            setTotalTime(prev=>

                                prev + usedTime
                            );

                            setCurrentLevel(2);

                            navigate(
                                "/level2"
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

export default Level1;