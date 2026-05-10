import { GameContext } from "../context/GameContext";
import "./Result.css";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
    useContext,
    useEffect,
    useState
} from "react";
function Result() {

    const {
        teamName,
        score,
        warnings,
        currentLevel
    } = useContext(GameContext);

useEffect(()=>{

    const savePlayer =
    async()=>{

        try{

            await API.post(

                "/players/save",

                {

                    teamName,
                    score,
                    level:currentLevel,
                    warnings
                }
            );

            console.log(
                "Player Saved"
            );
        }

        catch(err){

            console.log(err);
        }
    };

    savePlayer();

},[]);


    const navigate = useNavigate();

    const getRank = ()=>{

        if(score >= 1000){
            return "Smart Champ 🏆";
        }

        if(score >= 700){
            return "Mastermind";
        }

        if(score >= 400){
            return "Strategist";
        }

        if(score >= 200){
            return "Challenger";
        }

        return "Beginner";
    };

    return (

        <div className="result-page">

            <div className="result-card">

                <h1>
                    GAME COMPLETED 🎮
                </h1>

                <h2>
                    Team :
                    {teamName}
                </h2>

                <div className="result-stats">

                    <div className="stat-box">

                        <h3>
                            Final Score
                        </h3>

                        <p>{score}</p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Leaderboard Position
                        </h3>

                        <p># --</p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Warnings
                        </h3>

                        <p>{warnings}</p>

                    </div>

                    <div className="stat-box">

                        <h3>
                            Levels Completed
                        </h3>

                        <p>8/8</p>

                    </div>

                </div>

                <div className="trophy-section">

                    <div className="trophy">

                        🏆

                    </div>

                    <h2>
                        Congratulations!
                    </h2>

                    <p>
                        You completed Smart
                        Champs Challenge.
                    </p>

                </div>

                <div className="result-buttons">

                    <button
                        onClick={()=>
                            navigate("/")
                        }
                    >

                        PLAY AGAIN

                    </button>

                    <button
                        onClick={()=>
                            navigate("/leaderboard")
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