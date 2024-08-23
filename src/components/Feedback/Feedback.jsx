
const Feedback = ({ feedback, score, onRestart, scoreVisibility }) => {

  return (
    <div>
      {/* Display the feedback message and the score */}
      {feedback && (
        <>
          <p>{feedback}</p>

          {scoreVisibility && <h3>Your Score: {score}</h3>}

          {/* Show the restart button if the game is over */}
          {feedback.includes("Game over") && <button onClick={onRestart}>Restart</button>}
        </>
      )}
    </div>)
}

export default Feedback
