import {
    createContext,
    useEffect,
    useState
} from "react";

import API
from "../services/api";

export const GameContext =
createContext();

function GameProvider({ children }) {

    const [teamName,setTeamName] =
    useState(

        localStorage.getItem(
            "teamName"
        ) || ""

    );

    const [score,setScore] =
    useState(

        Number(
            localStorage.getItem(
                "score"
            )
        ) || 0

    );

    const [

        currentLevel,
        setCurrentLevel

    ] = useState(

        Number(
            localStorage.getItem(
                "currentLevel"
            )
        ) || 1

    );

    const [warnings,setWarnings] =
    useState(

        Number(
            localStorage.getItem(
                "warnings"
            )
        ) || 0

    );

    const [

        totalTime,
        setTotalTime

    ] = useState(

        Number(
            localStorage.getItem(
                "totalTime"
            )
        ) || 0
    );

    const [loading,setLoading] =
    useState(false);

    useEffect(()=>{

        localStorage.setItem(
            "teamName",
            teamName
        );

    },[teamName]);

    useEffect(()=>{

        localStorage.setItem(
            "score",
            score
        );

    },[score]);

    useEffect(()=>{

        localStorage.setItem(
            "currentLevel",
            currentLevel
        );

    },[currentLevel]);

    useEffect(()=>{

        localStorage.setItem(
            "warnings",
            warnings
        );

    },[warnings]);

    useEffect(()=>{

        localStorage.setItem(
            "totalTime",
            totalTime
        );

    },[totalTime]);

    useEffect(()=>{

        if(!teamName) return;

        const saveProgress =
        async()=>{

            try{

                await API.post(

                    "/players/save",

                    {

                        teamName,

                        score,

                        level:
                        currentLevel,

                        warnings,

                        levelsCompleted:
                        currentLevel - 1,

                        totalTime
                    }
                );

                console.log(
                    "Progress Auto Saved"
                );
            }

            catch(err){

                console.log(err);
            }
        };

        saveProgress();

    },[

        score,
        currentLevel,
        warnings,
        totalTime
    ]);

    return (

        <GameContext.Provider

            value={{

                teamName,
                setTeamName,

                score,
                setScore,

                currentLevel,
                setCurrentLevel,

                warnings,
                setWarnings,

                totalTime,
                setTotalTime,

                loading,
                setLoading
            }}
        >

            {children}

        </GameContext.Provider>
    );
}

export default GameProvider;