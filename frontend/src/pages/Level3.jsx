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

    const [gamePuzzles] =
    useState(()=>{

        return [

            ...puzzles

        ]

        .sort(()=>

            Math.random() - 0.5
        )

        .slice(0,10);
    });

    const [

        currentPuzzle,
        setCurrentPuzzle

    ] = useState(0);

    const [

        revealedTiles,
        setRevealedTiles

    ] = useState({});

    const [

        guesses,
        setGuesses

    ] = useState({});

    const [

        solvedPuzzles,
        setSolvedPuzzles

    ] = useState([]);

    const [

        shownHints,
        setShownHints

    ] = useState([]);

    const [

        timeLeft,
        setTimeLeft

    ] = useState(120);

    const [

        gameOver,
        setGameOver

    ] = useState(false);

    const [

        levelComplete,
        setLevelComplete

    ] = useState(false);

    const puzzle =
    gamePuzzles[currentPuzzle] || {};

    const totalTiles = 25;

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

        if(

            solvedPuzzles.length ===
            gamePuzzles.length

        ){

            setLevelComplete(true);

            setGameOver(true);
        }

    },[
        solvedPuzzles,
        gamePuzzles
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

    const revealTile = ()=>{

        if(gameOver) return;

        const currentTiles =

        revealedTiles[
            currentPuzzle
        ] || [];

        if(
            currentTiles.length >=
            totalTiles
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

            currentTiles.includes(
                randomTile
            )
        );

        setRevealedTiles(prev=>({

            ...prev,

            [currentPuzzle]:[

                ...currentTiles,
                randomTile
            ]
        }));
    };

    const moveToNextPuzzle = ()=>{

        const unsolved =

        gamePuzzles.findIndex(
            (_,index)=>

                !solvedPuzzles.includes(
                    index
                )
        );

        if(unsolved !== -1){

            setCurrentPuzzle(
                unsolved
            );
        }
    };

    const handleGuess = ()=>{

        if(gameOver) return;

        const currentGuess =

        guesses[currentPuzzle]
        || "";

        if(

            currentGuess
            .trim()
            .toLowerCase()

            ===

            puzzle.answer
            ?.trim()
            .toLowerCase()

        ){

            if(

                solvedPuzzles.includes(
                    currentPuzzle
                )
            ) return;

            setScore(prev=>

                prev + 10
            );

            const updatedSolved = [

                ...solvedPuzzles,
                currentPuzzle
            ];

            setSolvedPuzzles(
                updatedSolved
            );

            toast.success(
                "Correct! +10"
            );

            setTimeout(()=>{

                const nextPuzzle =

                gamePuzzles.findIndex(
                    (_,index)=>

                        !updatedSolved.includes(
                            index
                        )
                );

                if(nextPuzzle !== -1){

                    setCurrentPuzzle(
                        nextPuzzle
                    );
                }

            },700);
        }

        else{

            toast.error(
                "Wrong Guess!"
            );
        }
    };

    const showHint = ()=>{

        if(

            shownHints.includes(
                currentPuzzle
            )

        ) return;

        setShownHints(prev=>[

            ...prev,
            currentPuzzle
        ]);

        toast(

            `Answer has ${
                puzzle.answer.length
            } letters`
        );
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

                    Solved :

                    {
                        solvedPuzzles.length
                    }

                    /10

                </h2>

            </div>

            <h1>
                PUZZLE REVEAL
            </h1>

            <p className="hint">

                Hint :
                {puzzle.hint}

            </p>

            {

                shownHints.includes(
                    currentPuzzle
                )

                &&

                <p
                    className="hint"
                >

                    Answer contains

                    {" "}

                    {
                        puzzle.answer
                        ?.length
                    }

                    {" "}

                    letters

                </p>
            }

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

                                (
                                    revealedTiles[
                                        currentPuzzle
                                    ] || []
                                )

                                .includes(index)

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

                <button
                    onClick={showHint}
                    disabled={gameOver}
                >

                    Show Hint

                </button>

                <input
                    type="text"

                    placeholder=
                    "Guess Landmark"

                    value={
                        guesses[
                            currentPuzzle
                        ] || ""
                    }

                    disabled={gameOver}

                    onChange={(e)=>{

                        setGuesses(prev=>({

                            ...prev,

                            [currentPuzzle]:
                            e.target.value
                        }));
                    }}
                />

                <button
                    onClick={handleGuess}
                    disabled={gameOver}
                >

                    Submit Guess

                </button>

            </div>

            <div
                className="question-selector"
            >

                {

                    gamePuzzles.map(
                    (_,index)=>(

                        <button
                            key={index}

                            className={`

                                selector-btn

                                ${
                                    currentPuzzle
                                    === index

                                    ?

                                    "active-selector"

                                    :

                                    ""
                                }

                                ${
                                    solvedPuzzles
                                    .includes(index)

                                    ?

                                    "solved-selector"

                                    :

                                    ""
                                }
                            `}

                            onClick={()=>{

                                setCurrentPuzzle(
                                    index
                                );
                            }}
                        >

                            {

                                solvedPuzzles
                                .includes(index)

                                ?

                                "✅"

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