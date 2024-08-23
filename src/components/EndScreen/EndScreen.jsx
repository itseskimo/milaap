import './EndScreen.css'

const EndScreen = ({ score, onRestart }) => (

  <div className="end-screen">
    <h1>Quiz Completed</h1>
    <p>Your final score is: {score}</p>
    <button onClick={onRestart}>Restart Quiz</button>
  </div>
);

export default EndScreen;








