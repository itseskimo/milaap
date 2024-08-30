import './Feedback.css'

const Feedback = ({ feedback, score, onRestart, scoreVisibility, messageVisibility }) => {

  return (
    <div className='feedback-container'>
      {/* Display the feedback message and the score */}
      {feedback && (
        <>
          {messageVisibility ? <p className='result'>Previous answer was
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
