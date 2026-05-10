import Navbar from "../components/Navbar";
import "./Home.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <Navbar />

      <div className="hero-section">

        <motion.div
          initial={{ opacity:0, y:50 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:1 }}
          className="hero-content"
        >

          <h1>
            ENTER THE <span>SMART CHAMPS</span> ARENA
          </h1>

          <p>
            Battle through 10 thrilling levels of quizzes,
            puzzles, memory games, logic challenges and more.
          </p>

          <div className="hero-buttons">

            <Link to="/register">
              <button className="play-btn">
                PLAY NOW
              </button>
            </Link>

            <Link to="/leaderboard">
              <button className="leaderboard-btn">
                LEADERBOARD
              </button>
            </Link>

          </div>

        </motion.div>

      </div>

      <div className="levels-preview">

        <h2>GAME LEVELS</h2>

        <div className="level-cards">

          <div className="card">
            <h3>Color Smash Quiz</h3>
            <p>Hit color blocks and answer category questions.</p>
          </div>

          <div className="card">
            <h3>Maze Escape</h3>
            <p>Navigate the maze while solving timed challenges.</p>
          </div>

          <div className="card">
            <h3>Puzzle Reveal</h3>
            <p>Reveal hidden landmarks using clues and logic.</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;