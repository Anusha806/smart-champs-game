import {
    useEffect,
    useState
} from "react";

import API
from "../services/api";

import "./Leaderboard.css";

function Leaderboard() {

    const [players,setPlayers] =
    useState([]);

    const [loading,setLoading] =
    useState(true);

    useEffect(()=>{

        const fetchLeaderboard =
        async()=>{

            try{

                const response =
                await API.get(
                    "/players/leaderboard"
                );

                setPlayers(
                    response.data
                );
            }

            catch(err){

                console.log(err);
            }

            finally{

                setLoading(false);
            }
        };

        fetchLeaderboard();

    },[]);

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

    return (

        <div className="leaderboard-page">

            <h1>
                GLOBAL LEADERBOARD 🏆
            </h1>

            {
                loading ?

                <h2>
                    Loading...
                </h2>

                :

                <div className="leaderboard-table">

                    <div className="leaderboard-header">

                        <span>Rank</span>

                        <span>Team</span>

                        <span>Score</span>

                        <span>Levels</span>

                        <span>Time</span>

                    </div>

                    {
                        players.map(
                            (player,index)=>(

                            <div
                                key={player._id}

                                className={

                                    index === 0

                                    ?

                                    "leaderboard-row first"

                                    :

                                    "leaderboard-row"
                                }
                            >

                                <span>
                                    #{index+1}
                                </span>

                                <span>

                                    {
                                        player.teamName
                                    }

                                </span>

                                <span>

                                    {
                                        player.score
                                    }

                                </span>

                                <span>

                                    {
                                        player.levelsCompleted || 0
                                    }

                                    /8

                                </span>

                                <span>

                                    {

                                        formatTime(

                                            player.totalTime || 0
                                        )
                                    }

                                </span>

                            </div>
                        ))
                    }

                </div>
            }

        </div>
    );
}

export default Leaderboard;