import Navbar from "../components/Navbar";

import "./Home.css";

import { motion }
from "framer-motion";

import { Link }
from "react-router-dom";

function Home() {

    return (

        <div className="home">

            <Navbar />

            <div className="hero-section">

                <motion.div

                    initial={{
                        opacity:0,
                        y:50
                    }}

                    animate={{
                        opacity:1,
                        y:0
                    }}

                    transition={{
                        duration:1
                    }}

                    className="hero-content"
                >

                    <h1>

                        ENTER THE

                        <span>
                            SMART CHAMPS
                        </span>

                        ARENA

                    </h1>

                    <p>

                        Battle through
                        8 thrilling levels
                        of quizzes,
                        puzzles,
                        memory games,
                        logic challenges
                        and more.

                    </p>

                    <div className="hero-buttons">

                        <Link to="/register">

                            <button
                                className="play-btn"
                            >

                                PLAY NOW

                            </button>

                        </Link>

                        <Link to="/leaderboard">

                            <button
                                className=
                                "leaderboard-btn"
                            >

                                LEADERBOARD

                            </button>

                        </Link>

                    </div>

                </motion.div>

            </div>

            <div className="levels-preview">

                <h2>
                    GAME LEVELS
                </h2>

                <div className="level-cards">

                    <div className="card">

                        <h3>
                            Level 1
                        </h3>

                        <p>

                            Color Smash Quiz
                            with category
                            based challenges.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 2
                        </h3>

                        <p>

                            Rapid Fire Quiz
                            Arena with timed
                            questions.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 3
                        </h3>

                        <p>

                            Puzzle Reveal
                            where hidden
                            images unlock.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 4
                        </h3>

                        <p>

                            Crossword Clash
                            filled with
                            tricky clues.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 5
                        </h3>

                        <p>

                            Speed Pattern
                            Reactor to test
                            memory reflexes.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 6
                        </h3>

                        <p>

                            Memory Grid Rush
                            with hidden
                            symbol matching.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 7
                        </h3>

                        <p>

                            Logic Reactor
                            packed with
                            reasoning puzzles.

                        </p>

                    </div>

                    <div className="card">

                        <h3>
                            Level 8
                        </h3>

                        <p>

                            Trophy Path
                            Finale for the
                            ultimate showdown.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Home;