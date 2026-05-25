import {
    useContext,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import { useNavigate }
from "react-router-dom";

import API
from "../services/api";

import "./Register.css";

import toast
from "react-hot-toast";

function Register() {

    const {

        setTeamName,
        setScore,
        setCurrentLevel,
        setWarnings,
        setTotalTime

    } = useContext(GameContext);

    const [team,setTeam] =
    useState("");

    const [loading,setLoading] =
    useState(false);

    const navigate =
    useNavigate();

    const handleStart =
    async()=>{

        if(team.trim() === ""){

            toast.error(
                "Please enter team name"
            );

            return;
        }

        try{

            setLoading(true);

            const response =
            await API.get(

                `/players/${team}`
            );

            const player =
            response.data;

            if(player){

                if(

                    player.levelsCompleted >= 8

                ){

                    toast.success(

                        "Game Already Completed"
                    );

                    navigate("/leaderboard");

                    return;
                }

                localStorage.clear();

                setTeamName(
                    player.teamName
                );

                setScore(
                    player.score || 0
                );

                setCurrentLevel(
                    player.level || 1
                );

                setWarnings(
                    player.warnings || 0
                );

                setTotalTime(
                    player.totalTime || 0
                );

                toast.success(
                    "Progress Restored"
                );

                navigate(

                    `/level${player.level || 1}`
                );

                return;
            }

        }

        catch(err){

            console.log(err);
        }

        try{

            localStorage.clear();

            setTeamName(team);

            setScore(0);

            setCurrentLevel(1);

            setWarnings(0);

            setTotalTime(0);

            await API.post(

                `/questions/assign-questions/${team}`,

                {}
            );

            toast.success(
                "Game Loaded Successfully"
            );

            navigate("/level1");

        }

        catch(err){

            console.log(err);

            toast.error(
                "Failed to start game"
            );
        }

        finally{

            setLoading(false);
        }
    };

    return (

        <div className="register-page">

            <div className="register-card">

                <h1>
                    ENTER THE ARENA
                </h1>

                <p>

                    Register your team
                    and begin the
                    challenge.

                </p>

                <input
                    type="text"

                    placeholder=
                    "Enter Team Name"

                    value={team}

                    onChange={(e)=>

                        setTeam(
                            e.target.value
                        )
                    }
                />

                <button

                    onClick={handleStart}

                    disabled={loading}
                >

                    {
                        loading

                        ?

                        "STARTING..."

                        :

                        "START GAME"
                    }

                </button>

            </div>

        </div>
    );
}

export default Register;