import {
    useContext,
    useEffect,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import puzzles
from "../data/puzzles";

import "./Level3.css";

import toast
from "react-hot-toast";

import { useNavigate }
from "react-router-dom";

function Level3() {

    const {

        score,
        setScore,
        setCurrentLevel,
        setWarnings

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    const [

        currentPuzzle,
        setCurrentPuzzle

    ] = useState(0);

    const [

        revealedTiles,
        setRevealedTiles

    ] = useState([]);

    const [guess,setGuess] =
    useState("");

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

    const puzzle =
    puzzles[currentPuzzle] || {};

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

    const totalTiles = 25;

    const revealTile = ()=>{

        if(
            revealedTiles.length >=
            totalTiles ||

            gameOver
        ) return;

        let randomTile;

        do{

            randomTile =
            Math.floor(

                Math.random() *
                totalTiles
            );

        }

        while(

            revealedTiles.includes(
                randomTile
            )
        );

        setRevealedTiles(prev=>[

            ...prev,
            randomTile

        ]);
    };

    const handleGuess = ()=>{

        if(
            timeLeft <= 0 ||
            gameOver
        ) return;

        if(

            guess
            .trim()
            .toLowerCase()

            ===

            puzzle.answer
            ?.trim()
            .toLowerCase()

        ){

            const bonus =
            Math.max(

                50 -
                revealedTiles.length * 2,

                10
            );

            setScore(prev=>

                prev + bonus
            );

            toast.success(

                `Correct! +${bonus} points`
            );

            if(

                currentPuzzle <
                puzzles.length - 1

            ){

                setCurrentPuzzle(prev=>

                    prev + 1
                );

                setRevealedTiles([]);

                setGuess("");
            }

            else{

                toast.success(

                    "All puzzles completed!"
                );

                setLevelComplete(true);

                setGameOver(true);
            }
        }

        else{

            toast.error(
                "Wrong Guess!"
            );
        }
    };

    return (

        <div className="level3-page">

            <div className="level3-top">

                <h2>
                    Score : {score}
                </h2>

                <h2>
                    ⏳ {timeLeft}s
                </h2>

                <h2>

                    Puzzle {

                        Math.min(

                            currentPuzzle + 1,

                            puzzles.length
                        )

                    }/

                    {puzzles.length}

                </h2>

            </div>

            <h1>
                PUZZLE REVEAL
            </h1>

            <p className="hint">

                Hint :
                {puzzle.hint}

            </p>

            <div className="puzzle-grid">

                {
                    Array.from({
                        length:25
                    }).map((_,index)=>(

                        <div
                            key={index}
                            className="tile"
                        >

                            {

                                revealedTiles.includes(index)

                                &&

                                <div

                                    className=
                                    "revealed-image"

                                    style={{

                                        backgroundImage:
                                        `url(${puzzle.image})`,

                                        backgroundSize:
                                        "500px 500px",

                                        backgroundPosition:
                                        `${-(index % 5) * 100}px ${-Math.floor(index / 5) * 100}px`
                                    }}
                                ></div>
                            }

                        </div>
                    ))
                }

            </div>

            <div className="controls">

                <button
                    onClick={revealTile}
                    disabled={gameOver}
                >

                    Reveal Tile

                </button>

                <input
                    type="text"

                    placeholder=
                    "Guess Landmark"

                    value={guess}

                    disabled={gameOver}

                    onChange={(e)=>

                        setGuess(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={handleGuess}
                    disabled={gameOver}
                >

                    Submit Guess

                </button>

            </div>

            {
                gameOver &&

                <div className="game-over">

                    <h1>

                        {
                            levelComplete

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

                            setCurrentLevel(4);

                            navigate(
                                "/level4"
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

export default Level3;