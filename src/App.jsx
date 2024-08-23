import './App.css'
import React, { useState } from "react";
import QuizContainer from './components/QuizContainer/QuizContainer';
import StartScreen from './components/StartScreen/StartScreen';
import EndScreen from './components/EndScreen/EndScreen';

function App() {
  // Declare state variables to manage the quiz's current stage and the final score
  const [stage, setStage] = useState("start"); // "start", "quiz", "end"
  const [finalScore, setFinalScore] = useState(0);

  // Function to transition from the start screen to the quiz
  const startQuiz = () => {
    setStage("quiz");
  };

  // Function to transition from the quiz to the end screen, setting the final score
  const endQuiz = (score) => {
    setFinalScore(score);
    setStage("end");
  };

  // Function to restart the quiz, resetting the stage and score
  const restartQuiz = () => {
    setStage("start");
    setFinalScore(0);
  };

  return (
    <>
      {/* Main container for the app, rendering different components based on the current stage */}
      <div className="app-container">
        {/* Show the StartScreen component if the stage is "start" */}
        {stage === "start" && <StartScreen onStart={startQuiz} />}
        {/* Show the QuizContainer component if the stage is "quiz" */}
        {stage === "quiz" && <QuizContainer onEnd={endQuiz} />}
        {/* Show the EndScreen component if the stage is "end" */}
        {stage === "end" && <EndScreen score={finalScore} onRestart={restartQuiz} />}
      </div>
    </>
  );
}

export default App;

