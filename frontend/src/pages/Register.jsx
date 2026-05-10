import {
    useContext,
    useState
} from "react";

import { GameContext }
from "../context/GameContext";

import { useNavigate }
from "react-router-dom";

import API from "../services/api";

import "./Register.css";

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

            alert(
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

                alert(
                    "Progress Restored!"
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

        setTeamName(team);

        setScore(0);

        setCurrentLevel(1);

        setWarnings(0);

        navigate("/level1");
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
                >

                    {
                        loading
                        ?
                        "LOADING..."
                        :
                        "START GAME"
                    }

                </button>

            </div>

        </div>
    );
}

export default Register;