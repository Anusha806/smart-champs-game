function Timer({ timeLeft }) {

    return (
        <div
            style={{
                fontSize:"1.3rem",
                fontWeight:"bold",
                color:"#38BDF8"
            }}
        >
            ⏳ {timeLeft}s
        </div>
    );
}

export default Timer;