// import { useState, useEffect } from 'react';
// import quizData from '../../config/quizData.json';
// import Question from '../Question/Question';
// import Feedback from '../Feedback/Feedback';
// import './QuizContainer.css';

// // Function to shuffle an array (Fisher-Yates shuffle algorithm)
// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// const QuizContainer = ({ onEnd }) => {
//   const [quizState, setQuizState] = useState({
//     level: "easy",
//     currentQuestionIndex: 0,
//     correctAnswers: 0,
//     score: 0,
//     baseScore: 0,  // New state to keep track of the score before starting the level
//     userAnswer: "",
//     feedback: "",
//     levelFailed: false,
//     levelPassed: false,
//     shuffledQuestions: shuffleArray([...quizData["easy"]])  // Shuffle questions for the initial level
//   });

//   const [countdown, setCountdown] = useState(3);
//   const [questionTimer, setQuestionTimer] = useState(15);

//   const currentQuestion = quizState.shuffledQuestions[quizState.currentQuestionIndex];

//   useEffect(() => {
//     if (questionTimer > 0) {
//       const timerId = setTimeout(() => {
//         setQuestionTimer((prev) => prev - 1);
//       }, 1000);

//       return () => clearTimeout(timerId);
//     } else {
//       handleSubmit();
//     }
//   }, [questionTimer]);

//   useEffect(() => {
//     if (quizState.levelPassed) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);

//       const proceedTimer = setTimeout(() => {
//         proceedToNextLevel();
//       }, 3000);

//       return () => {
//         clearInterval(timer);
//         clearTimeout(proceedTimer);
//       };
//     }
//   }, [quizState.levelPassed]);

//   const handleAnswerChange = (answer) => {
//     setQuizState((prevState) => ({
//       ...prevState,
//       userAnswer: answer
//     }));
//   };

//   const handleSubmit = () => {
//     let correct = false;

//     if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
//       correct = quizState.userAnswer === currentQuestion.correctAnswer;
//     } else if (currentQuestion.type === "text-input") {
//       correct = quizState.userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
//     }

//     let newLevel = quizState.level;
//     let newIndex = quizState.currentQuestionIndex;
//     let newScore = quizState.score;
//     let newFeedback = "";
//     let newCorrectAnswers = quizState.correctAnswers;
//     let newLevelPassed = false;

//     if (correct) {
//       newScore += quizState.level === "easy" ? 10 : quizState.level === "medium" ? 20 : quizState.level === "hard" ? 30 : 0;
//       newFeedback = "Correct!";
//       newCorrectAnswers += 1;
//     } else {
//       newFeedback = "Incorrect!";
//     }

//     if (newIndex + 1 < quizState.shuffledQuestions.length) {
//       newIndex++;
//       resetQuestionTimer();
//     } else {
//       if (newCorrectAnswers >= 2) {
//         newLevelPassed = true;
//         newFeedback = `Congratulations! You've passed the ${newLevel} level with a total score of ${newScore}. Proceeding to the next level in ${countdown}...`;

//         if (newLevel === "hard") {
//           newFeedback = `Congratulations! You've completed all levels.`;
//         }
//       } else {
//         newFeedback = `You did not pass the ${newLevel} level. You can retry the level or restart the quiz.`;
//         setQuizState((prevState) => ({
//           ...prevState,
//           feedback: newFeedback,
//           levelFailed: true,
//           score: newScore,
//         }));
//         return;
//       }
//     }

//     setQuizState((prevState) => ({
//       ...prevState,
//       level: newLevel,
//       currentQuestionIndex: newIndex,
//       score: newScore,
//       userAnswer: "",
//       feedback: newFeedback,
//       correctAnswers: newCorrectAnswers,
//       levelFailed: false,
//       levelPassed: newLevelPassed,
//     }));
//   };

//   const resetQuestionTimer = () => {
//     setQuestionTimer(15);
//   };

//   const retryLevel = () => {
//     setQuizState((prevState) => ({
//       ...prevState,
//       currentQuestionIndex: 0,
//       correctAnswers: 0,
//       score: quizState.baseScore,  // Reset the score to the baseScore
//       userAnswer: "",
//       feedback: "",
//       levelFailed: false,
//       levelPassed: false,
//       shuffledQuestions: shuffleArray([...quizData[quizState.level]])  // Reshuffle questions when retrying the level
//     }));
//     setCountdown(3);
//     resetQuestionTimer();
//   };

//   const proceedToNextLevel = () => {
//     let newLevel;
//     if (quizState.level === "easy") {
//       newLevel = "medium";
//     } else if (quizState.level === "medium") {
//       newLevel = "hard";
//     } else if (quizState.level === "hard") {
//       onEnd(quizState.score);
//       return;
//     }

//     setQuizState((prevState) => ({
//       ...prevState,
//       level: newLevel,
//       currentQuestionIndex: 0,
//       correctAnswers: 0,
//       baseScore: prevState.score,  // Update baseScore to the current score
//       userAnswer: "",
//       feedback: "",
//       levelFailed: false,
//       levelPassed: false,
//       shuffledQuestions: shuffleArray([...quizData[newLevel]])  // Shuffle questions for the new level
//     }));
//     setCountdown(3);
//     resetQuestionTimer();
//   };

//   return (
//     <div className="quiz-container">
//       <div className='countdown-container'>
//         <h2>Level: <span style={{ color: getLevelColor(quizState.level) }}>{quizState.level}</span></h2>
//         {!quizState.levelFailed && !quizState.levelPassed && <span className="timer">{questionTimer}</span>}
//       </div>

//       {!quizState.levelFailed && !quizState.levelPassed ? (
//         <>
//           <Question question={currentQuestion} userAnswer={quizState.userAnswer} onAnswerChange={handleAnswerChange} />
//           <button onClick={handleSubmit} className='quiz-submit-button'>Submit</button>
//           <Feedback feedback={quizState.feedback} />
//         </>
//       ) : quizState.levelPassed ? (
//         <>
//           <Feedback feedback={quizState.feedback} />
//           <p>Proceeding in: {countdown}</p>
//         </>
//       ) : (
//         <>
//           <Feedback feedback={quizState.feedback} score={quizState.score} scoreVisibility={true} />
//           <button onClick={retryLevel} className='quiz-submit-button'>Retry Level</button>
//           {quizState.level !== "easy" && <button className='quiz-submit-button' onClick={() => onEnd(quizState.score)}>Restart Quiz</button>}
//         </>
//       )}
//     </div>
//   );
// };

// const getLevelColor = (level) => {
//   switch (level) {
//     case "easy":
//       return "green";
//     case "medium":
//       return "#FFDB58";
//     case "hard":
//       return "red";
//     default:
//       return "black";
//   }
// };

// export default QuizContainer;



import { useState, useEffect } from 'react';
import quizData from '../../config/quizData.json';
import Question from '../Question/Question';
import Feedback from '../Feedback/Feedback';
import './QuizContainer.css';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizContainer = ({ onEnd }) => {
  const loadProgress = () => {
    const savedProgress = localStorage.getItem('quizProgress');
    return savedProgress ? JSON.parse(savedProgress) : null;
  };

  const saveProgress = (state) => {
    localStorage.setItem('quizProgress', JSON.stringify(state));
  };

  const clearProgress = () => {
    localStorage.removeItem('quizProgress');
  };

  const [quizState, setQuizState] = useState(() => {
    const savedProgress = loadProgress();
    if (savedProgress) {
      return savedProgress;
    } else {
      return {
        level: "easy",
        currentQuestionIndex: 0,
        correctAnswers: 0,
        score: 0,
        baseScore: 0,
        userAnswer: "",
        feedback: "",
        levelFailed: false,
        levelPassed: false,
        shuffledQuestions: shuffleArray([...quizData["easy"]])
      };
    }
  });

  const [countdown, setCountdown] = useState(3);
  const [questionTimer, setQuestionTimer] = useState(15);
  const currentQuestion = quizState.shuffledQuestions[quizState.currentQuestionIndex];

  useEffect(() => {
    if (questionTimer > 0) {
      const timerId = setTimeout(() => {
        setQuestionTimer((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      handleSubmit();
    }
  }, [questionTimer]);

  useEffect(() => {
    if (quizState.levelPassed) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const proceedTimer = setTimeout(() => {
        proceedToNextLevel();
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(proceedTimer);
      };
    }
  }, [quizState.levelPassed]);

  const handleAnswerChange = (answer) => {
    setQuizState((prevState) => ({
      ...prevState,
      userAnswer: answer
    }));
  };

  const handleSubmit = () => {
    let correct = false;

    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
      correct = quizState.userAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "text-input") {
      correct = quizState.userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    }

    let newLevel = quizState.level;
    let newIndex = quizState.currentQuestionIndex;
    let newScore = quizState.score;
    let newFeedback = "";
    let newCorrectAnswers = quizState.correctAnswers;
    let newLevelPassed = false;

    if (correct) {
      newScore += quizState.level === "easy" ? 10 : quizState.level === "medium" ? 20 : quizState.level === "hard" ? 30 : 0;
      newFeedback = "Correct!";
      newCorrectAnswers += 1;
    } else {
      newFeedback = "Incorrect!";
    }

    if (newIndex + 1 < quizState.shuffledQuestions.length) {
      newIndex++;
      resetQuestionTimer();
    } else {
      if (newCorrectAnswers >= 2) {
        newLevelPassed = true;
        newFeedback = `Congratulations! You've passed the ${newLevel} level with a total score of ${newScore}. Proceeding to the next level in ${countdown}...`;

        if (newLevel === "hard") {
          newFeedback = `Congratulations! You've completed all levels.`;
          clearProgress(); // Clear progress after completing all levels
        }
      } else {
        newFeedback = `You did not pass the ${newLevel} level. You can retry the level or restart the quiz.`;
        setQuizState((prevState) => {
          const updatedState = {
            ...prevState,
            feedback: newFeedback,
            levelFailed: true,
            score: newScore,
          };
          saveProgress(updatedState);
          return updatedState;
        });
        return;
      }
    }

    const updatedState = {
      ...quizState,
      level: newLevel,
      currentQuestionIndex: newIndex,
      score: newScore,
      userAnswer: "",
      feedback: newFeedback,
      correctAnswers: newCorrectAnswers,
      levelFailed: false,
      levelPassed: newLevelPassed,
    };

    saveProgress(updatedState);
    setQuizState(updatedState);
  };

  const resetQuestionTimer = () => {
    setQuestionTimer(15);
  };

  const retryLevel = () => {
    const updatedState = {
      ...quizState,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      score: quizState.baseScore,
      userAnswer: "",
      feedback: "",
      levelFailed: false,
      levelPassed: false,
      shuffledQuestions: shuffleArray([...quizData[quizState.level]])
    };
    saveProgress(updatedState);
    setQuizState(updatedState);
    setCountdown(3);
    resetQuestionTimer();
  };

  const proceedToNextLevel = () => {
    let newLevel;
    if (quizState.level === "easy") {
      newLevel = "medium";
    } else if (quizState.level === "medium") {
      newLevel = "hard";
    } else if (quizState.level === "hard") {
      onEnd(quizState.score);
      clearProgress(); // Clear progress when the quiz ends
      return;
    }

    const updatedState = {
      ...quizState,
      level: newLevel,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      baseScore: quizState.score,
      userAnswer: "",
      feedback: "",
      levelFailed: false,
      levelPassed: false,
      shuffledQuestions: shuffleArray([...quizData[newLevel]])
    };

    saveProgress(updatedState);
    setQuizState(updatedState);
    setCountdown(3);
    resetQuestionTimer();
  };

  return (
    <div className="quiz-container">
      <div className='countdown-container'>
        <h2>Level: <span style={{ color: getLevelColor(quizState.level) }}>{quizState.level}</span></h2>
        {!quizState.levelFailed && !quizState.levelPassed && <span className="timer">{questionTimer}</span>}
      </div>

      {!quizState.levelFailed && !quizState.levelPassed ? (
        <>
          <Question question={currentQuestion} userAnswer={quizState.userAnswer} onAnswerChange={handleAnswerChange} />
          <button onClick={handleSubmit} className='quiz-submit-button'>Submit</button>
          <Feedback feedback={quizState.feedback} />
        </>
      ) : quizState.levelPassed ? (
        <>
          <Feedback feedback={quizState.feedback} />
          <p>Proceeding in: {countdown}</p>
        </>
      ) : (
        <>
          <Feedback feedback={quizState.feedback} score={quizState.score} scoreVisibility={true} />
          <button onClick={retryLevel} className='quiz-submit-button'>Retry Level</button>
          {quizState.level !== "easy" && <button className='quiz-submit-button' onClick={() => { clearProgress(); onEnd(quizState.score); }}>Restart Quiz</button>}
        </>
      )}
    </div>
  );
};

const getLevelColor = (level) => {
  switch (level) {
    case "easy":
      return "green";
    case "medium":
      return "#FFDB58";
    case "hard":
      return "red";
    default:
      return "black";
  }
};

export default QuizContainer;
