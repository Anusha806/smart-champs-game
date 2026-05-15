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
        setWarnings

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

                setTeamName(
                    player.teamName
                );

                setScore(
                    player.score
                );

                setCurrentLevel(
                    player.level
                );

                setWarnings(
                    player.warnings
                );

                toast.success(
                    "Progress Restored"
                );

                navigate(
                    `/level${player.level}`
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
                "Failed to generate game"
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