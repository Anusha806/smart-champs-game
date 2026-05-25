import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import "./Level5.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level5() {

    const {

        score,
        setScore,
        setCurrentLevel,
        setWarnings,
        setTotalTime

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    useEffect(()=>{

    const savedTeam =

    localStorage.getItem(
        "teamName"
    );

    if(!savedTeam){

        toast.error(
            "Session Expired"
        );

        navigate("/register");
    }

},[]);

    const gridSize = 36;

    const maxRounds = 10;

    const [round,setRound] =
    useState(1);

    const [pattern,setPattern] =
    useState([]);

    const [

        currentGlow,
        setCurrentGlow

    ] = useState(null);

    const [

        playerInput,
        setPlayerInput

    ] = useState([]);

    const [

        isShowing,
        setIsShowing

    ] = useState(true);

    const [

        gameOver,
        setGameOver

    ] = useState(false);

    const [

        levelComplete,
        setLevelComplete

    ] = useState(false);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(150);

    useEffect(()=>{

        generatePattern();

    },[round]);

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

    const getSequenceLength = ()=>{

        if(round <= 3){

            return 3;
        }

        if(round <= 6){

            return 4;
        }

        return 5;
    };

    const generatePattern = ()=>{

        const sequenceLength =
        getSequenceLength();

        let temp = [];

        while(

            temp.length <
            sequenceLength

        ){

            const random =
            Math.floor(

                Math.random() *
                gridSize
            );

            if(!temp.includes(random)){

                temp.push(random);
            }
        }

        setPattern(temp);

        setPlayerInput([]);

        showSequence(temp);
    };

    const showSequence =
    async(sequence)=>{

        setIsShowing(true);

        for(

            let i=0;
            i<sequence.length;
            i++

        ){

            setCurrentGlow(
                sequence[i]
            );

            await new Promise(resolve=>

                setTimeout(

                    resolve,

                    Math.max(
                        250,
                        700 - round*35
                    )
                )
            );

            setCurrentGlow(null);

            await new Promise(resolve=>

                setTimeout(
                    resolve,
                    200
                )
            );
        }

        setIsShowing(false);
    };

    const handleCellClick =
    (index)=>{

        if(

            isShowing ||
            gameOver ||
            timeLeft <= 0

        ) return;

        const nextInput = [

            ...playerInput,
            index
        ];

        setPlayerInput(nextInput);

        const currentStep =
        nextInput.length - 1;

        if(

            index !==
            pattern[currentStep]

        ){

            toast.error(
                "Wrong Sequence"
            );

            setPlayerInput([]);

            setTimeout(()=>{

                showSequence(pattern);

            },1000);

            return;
        }

        if(

            nextInput.length ===
            pattern.length

        ){

            toast.success(

                `Puzzle ${round} Cleared`
            );

            setScore(prev=>

                prev + 10
            );

            if(round === maxRounds){

                setLevelComplete(true);

                setGameOver(true);

                return;
            }

            setTimeout(()=>{

                setRound(prev=>

                    prev + 1
                );

            },1200);
        }
    };

    return (

        <div className="level5-page">

            <h1>
                SPEED PATTERN REACTOR
            </h1>

            <div className="top-info">

                <h2>
                    Score : {score}
                </h2>

                <h2>

                    Puzzle :
                    {round}/{maxRounds}

                </h2>

                <h2>
                    {timeLeft}s
                </h2>

            </div>

            <p className="instruction">

                Watch carefully and
                repeat the glowing
                sequence in exact order.

            </p>

            <div className="reactor-grid">

                {
                    Array.from({
                        length:gridSize
                    }).map((_,index)=>(

                        <div
                            key={index}

                            className={`

                                reactor-cell

                                ${
                                    currentGlow ===
                                    index

                                    ?

                                    "glow-cell"

                                    :

                                    ""
                                }

                                ${
                                    playerInput
                                    .includes(index)

                                    ?

                                    "selected-cell"

                                    :

                                    ""
                                }
                            `}

                            onClick={()=>{

                                handleCellClick(
                                    index
                                );
                            }}
                        >

                        </div>
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

                        Final Score :
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

                            setCurrentLevel(6);

                            navigate(
                                "/level6"
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

export default Level5;