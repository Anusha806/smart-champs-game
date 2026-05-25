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

                const sortedPlayers =

                    response.data.sort(

                        (a,b)=>{

                            if(
                                b.score !== a.score
                            ){

                                return (
                                    b.score - a.score
                                );
                            }

                            if(

                                b.levelsCompleted !==
                                a.levelsCompleted

                            ){

                                return (

                                    b.levelsCompleted -

                                    a.levelsCompleted
                                );
                            }

                            return (

                                a.totalTime -

                                b.totalTime
                            );
                        }
                    );

                setPlayers(
                    sortedPlayers
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

    const getMedal =
    (index)=>{

        if(index === 0){

            return "🥇";
        }

        if(index === 1){

            return "🥈";
        }

        if(index === 2){

            return "🥉";
        }

        return `#${index+1}`;
    };

    return (

        <div className="leaderboard-page">

            <h1>
                GLOBAL LEADERBOARD
            </h1>

            <p className="leaderboard-subtitle">

                Fastest minds.
                Highest scores.
                Ultimate champions.

            </p>

            {

                loading

                ?

                <h2>
                    Loading...
                </h2>

                :

                <div className="leaderboard-table">

                    <div className="leaderboard-header">

                        <span>
                            Rank
                        </span>

                        <span>
                            Team
                        </span>

                        <span>
                            Final Score
                        </span>

                        <span>
                            Levels
                        </span>

                        <span>
                            Total Time
                        </span>

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

                                <span
                                    className=
                                    "rank-badge"
                                >

                                    {
                                        getMedal(index)
                                    }

                                </span>

                                <span
                                    className=
                                    "team-name"
                                >

                                    {
                                        player.teamName
                                    }

                                </span>

                                <span
                                    className=
                                    "score-text"
                                >

                                    {
                                        player.score || 0
                                    }

                                </span>

                                <span>

                                    {

                                        player
                                        .levelsCompleted || 0
                                    }

                                    /8

                                </span>

                                <span>

                                    {

                                        formatTime(

                                            player
                                            .totalTime || 0
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