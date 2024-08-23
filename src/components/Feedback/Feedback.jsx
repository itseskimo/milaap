
const Feedback = ({ feedback, score, onRestart, scoreVisibility,messageVisibility }) => {
console.log(messageVisibility)
  return (
    <div>
      {/* Display the feedback message and the score */}
      {feedback && (
        <>
          {messageVisibility ? <p>Previous answer was
            <span style={{ color: feedback === 'Incorrect!' ? 'red' : 'green' }}> {feedback}</span> </p>
            :
            <p>{feedback}</p>}

          {scoreVisibility && <h3>Your Score: {score}</h3>}

          {/* Show the restart button if the game is over */}
          {feedback.includes("Game over") && <button onClick={onRestart}>Restart</button>}
        </>
      )}
    </div>)
}

export default Feedback
