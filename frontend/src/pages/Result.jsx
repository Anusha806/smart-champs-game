import {
    useContext,
    useEffect
} from "react";

import { GameContext }
from "../context/GameContext";

import "./Result.css";

import { useNavigate }
from "react-router-dom";

import API
from "../services/api";

import toast
from "react-hot-toast";

function Result() {

    const {

        teamName,
        score,
        warnings,
        totalTime,

        setTeamName,
        setScore,
        setWarnings,
        setCurrentLevel,
        setTotalTime

    } = useContext(GameContext);

    const navigate =
    useNavigate();

    useEffect(()=>{

        const savedTeam =

        localStorage.getItem(
            "teamName"
        );

        if(

            !teamName &&
            !savedTeam

        ){

            toast.error(
                "Session Expired"
            );

            navigate("/register");
        }

    },[
        teamName
    ]);

    const getTimeBonus =
    ()=>{

        if(totalTime <= 300){

            return 200;
        }

        if(totalTime <= 480){

            return 150;
        }

        if(totalTime <= 720){

            return 100;
        }

        if(totalTime <= 900){

            return 50;
        }

        return 0;
    };

    const finalScore =

    score + getTimeBonus();

    useEffect(()=>{

        const finalizeGame =
        async()=>{

            try{

                await API.post(

                    "/players/save",

                    {

                        teamName,

                        score:
                        finalScore,

                        level:8,

                        warnings,

                        levelsCompleted:8,

                        totalTime
                    }
                );

                console.log(
                    "Game Finalized"
                );
            }

            catch(err){

                console.log(err);
            }
        };

        if(teamName){

            finalizeGame();
        }

    },[
        teamName
    ]);

    const getRank = ()=>{

        if(finalScore >= 1000){

            return "Smart Champ";
        }

        if(finalScore >= 700){

            return "Mastermind";
        }

        if(finalScore >= 400){

            return "Strategist";
        }

        if(finalScore >= 200){

            return "Challenger";
        }

        return "Beginner";
    };

    const formatTime =
    (seconds)=>{

        const mins =

        Math.floor(
            seconds / 60
        );

        const secs =

        seconds % 60;

        return `${mins}m ${secs}s`;
    };

    const handleReplay =
    ()=>{

        localStorage.clear();

        setTeamName("");

        setScore(0);

        setWarnings(0);

        setCurrentLevel(1);

        setTotalTime(0);

        toast.success(
            "Ready For New Game"
        );

        navigate("/register");
    };

    return (

        <div className="result-page">

            <div className="result-card">

                <h1>
                    GAME COMPLETED
                </h1>

                <h2>

                    Team :
                    {teamName}

                </h2>

                <h2 className="rank-title">

                    Rank :
                    {getRank()}

                </h2>

                <div className="result-stats">

                    <div className="stat-box">

                        <h3>
                            Base Score
                        </h3>

                        <p>
                            {score}
                        </p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Time Bonus
                        </h3>

                        <p>
                            +{getTimeBonus()}
                        </p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Final Score
                        </h3>

                        <p>
                            {finalScore}
                        </p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Total Time
                        </h3>

                        <p>

                            {
                                formatTime(
                                    totalTime
                                )
                            }

                        </p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Warnings
                        </h3>

                        <p>
                            {warnings}
                        </p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Levels Completed
                        </h3>

                        <p>
                            8/8
                        </p>

                    </div>

                </div>

                <div className="trophy-section">

                    <div className="trophy">

                        🏆

                    </div>

                    <h2>
                        Congratulations
                    </h2>

                    <p>

                        You completed
                        Smart Champs
                        Challenge.

                    </p>

                </div>

                <div className="result-buttons">

                    <button
                        onClick={
                            handleReplay
                        }
                    >

                        PLAY AGAIN

                    </button>

                    <button
                        onClick={()=>

                            navigate(
                                "/leaderboard"
                            )
                        }
                    >

                        LEADERBOARD

                    </button>

                </div>

            </div>

        </div>
    );
}

export default Result;