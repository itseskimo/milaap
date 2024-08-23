import Question from '../Question/Question';
import Feedback from '../Feedback/Feedback';
import './QuizContainer.css';
import { getLevelColor, clearProgress } from '../../utils/utils';
import useQuiz from '../../utils/useQuiz';

const QuizContainer = ({ onEnd }) => {


  // Use the useQuiz hook to manage quiz state and logic
  const {
    quizState,           // State containing all quiz-related data
    currentQuestion,     // The current question to be displayed
    countdown,           // Countdown timer before proceeding to the next level
    questionTimer,       // Timer for answering the current question
    handleAnswerChange,  // Function to handle changes to the user's answer
    handleSubmit,        // Function to handle the submission of the current answer
    retryLevel,          // Function to retry the current level
  } = useQuiz(onEnd);     // Pass the onEnd callback to the hook

  return (
    <div className="quiz-container">
      {/* Container for the quiz content */}

      <div className='countdown-container'>
        {/* Container for displaying the current level and the question timer */}

        <h2>
          Level:
          {/* Display the current level with a color corresponding to the level's difficulty */}
          <span style={{ color: getLevelColor(quizState.level) }}>
            {quizState.level}
          </span>
        </h2>

        {/* Display the timer only if the level is neither failed nor passed */}
        {!quizState.levelFailed && !quizState.levelPassed && (
          <span className="timer">{questionTimer}</span>
        )}
      </div>

      {/* Conditional rendering based on whether the level is failed, passed, or in progress */}

      {/* If the level is in progress and neither failed nor passed */}
      {!quizState.levelFailed && !quizState.levelPassed ? (
        <>
          {/* Render the current question and allow the user to select an answer */}
          <Question
            question={currentQuestion} // Pass the current question data to the Question component
            userAnswer={quizState.userAnswer} // Pass the user's current answer state
            onAnswerChange={handleAnswerChange} // Handle changes in the user's answer selection
          />

          {/* Button to submit the user's answer */}
          <button onClick={handleSubmit} className='quiz-submit-button'>
            Submit
          </button>

          {/* Display feedback based on the submitted answer */}
          <Feedback
            feedback={quizState.feedback}
            messageVisibility={true} // Controls 'Previous answer was' visibilty
          />
        </>
      ) : quizState.levelPassed ? (
        <>
          {/* If the level is passed, display feedback and a countdown to the next level */}
          <Feedback feedback={quizState.feedback} />
          <p>Proceeding in: {countdown}</p>
        </>
      ) : (
        <>
          {/* If the level is failed, display feedback and options to retry the level or restart the quiz */}
          <Feedback
            feedback={quizState.feedback} // Display feedback message for failing the level
            score={quizState.score} // Display the user's current score
            scoreVisibility={true} // Ensure the score is visible
          />

          {/* Button to retry the current level */}
          <button onClick={retryLevel} className='quiz-submit-button'>
            Retry Level
          </button>

          {/* Button to restart the quiz from the beginning (only if not on the easy level) */}
          {quizState.level !== "easy" && (
            <button
              className='quiz-submit-button'
              onClick={() => { clearProgress(); onEnd(quizState.score); }}
            >
              Restart Quiz
            </button>
          )}
        </>
      )}
    </div>


  );
};


export default QuizContainer;
