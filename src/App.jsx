import './App.css'
import React, { useState } from "react";
import QuizContainer from './components/QuizContainer/QuizContainer'
import StartScreen from './components/StartScreen/StartScreen';
import EndScreen from './components/EndScreen/EndScreen'
function App() {

  const [stage, setStage] = useState("start"); // "start", "quiz", "end"
  const [finalScore, setFinalScore] = useState(0);

  const startQuiz = () => {
    setStage("quiz");
  };

  const endQuiz = (score) => {
    setFinalScore(score);
    setStage("end");
  };

  const restartQuiz = () => {
    setStage("start");
    setFinalScore(0);
  };

  return (
    <>
      {/* <QuizContainer/> */}
      <div className="app-container">
        {stage === "start" && <StartScreen onStart={startQuiz} />}
        {stage === "quiz" && <QuizContainer onEnd={endQuiz} />}
        {stage === "end" && <EndScreen score={finalScore} onRestart={restartQuiz} />}
      </div>
    </>
  )
}

export default App
