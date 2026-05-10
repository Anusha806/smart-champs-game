import "./QuestionCard.css";

function QuestionCard({ currentQuestion, handleAnswer }) {

    return (
        <div className="question-overlay">

            <div className="question-card">

                <h2>{currentQuestion.question}</h2>

                <div className="options">

                    {
                        currentQuestion.options.map((option,index)=>(
                            <button
                                key={index}
                                onClick={()=>handleAnswer(option)}
                            >
                                {option}
                            </button>
                        ))
                    }

                </div>

            </div>

        </div>
    );
}

export default QuestionCard;