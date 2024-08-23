import { useState, useEffect } from 'react';
import quizData from '../config/quizData.json'
import { shuffleArray, saveProgress, clearProgress } from './utils';


const useQuiz = (onEnd) => {

  // Load progress from localStorage or initialize with default values
  const loadProgress = () => JSON.parse(localStorage.getItem('quizProgress')) || {
    level: "easy",                   // Initial quiz level
    currentQuestionIndex: 0,         // Start with the first question
    correctAnswers: 0,               // No correct answers at the beginning
    score: 0,                        // Initial score is zero
    baseScore: 0,                    // Base score before starting the level
    userAnswer: "",                  // User's answer is initially empty
    feedback: "",                    // No feedback initially
    levelFailed: false,              // Level is not failed at the beginning
    levelPassed: false,              // Level is not passed at the beginning
    shuffledQuestions: shuffleArray([...quizData["easy"]]) // Shuffle questions for the "easy" level
  };





  // Initialize state with loaded progress or default values
  const [quizState, setQuizState] = useState(loadProgress);
  const [countdown, setCountdown] = useState(3);  // Countdown timer before proceeding to the next level
  const [questionTimer, setQuestionTimer] = useState(15); // Timer for answering the current question
  const currentQuestion = quizState.shuffledQuestions[quizState.currentQuestionIndex]; // Get the current question based on the current index

  // Effect to handle the countdown of the question timer
  useEffect(() => {
    if (questionTimer > 0) {
      const timerId = setTimeout(() => setQuestionTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timerId); // Cleanup timer on component unmount or when the timer changes
    } else {
      handleSubmit(); // Auto-submit the answer if the timer runs out
    }
  }, [questionTimer]); // This effect runs whenever the question timer changes

  // Effect to handle countdown and automatic progression to the next level after passing
  useEffect(() => {
    if (quizState.levelPassed) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000); // Decrease countdown every second
      const proceedTimer = setTimeout(proceedToNextLevel, 3000); // Proceed to the next level after 3 seconds
      return () => {
        clearInterval(timer); // Cleanup countdown timer
        clearTimeout(proceedTimer); // Cleanup proceed timer
      };
    }
  }, [quizState.levelPassed]); // This effect runs whenever the levelPassed state changes

  // Handle answer change (e.g., radio button selection)
  const handleAnswerChange = (answer) => {
    setQuizState((prevState) => ({
      ...prevState,   // Spread the existing state to retain all properties
      userAnswer: answer // Update the userAnswer with the new answer
    }));
  };

  // Handle submission of the current answer
  const handleSubmit = () => {
    let correct = false;

    // Check the type of question and validate the user's answer accordingly
    if (currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false") {
      correct = quizState.userAnswer === currentQuestion.correctAnswer; // Compare user's answer with the correct answer
    } else if (currentQuestion.type === "text-input") {
      correct = quizState.userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase(); // For text-input, ignore case and extra spaces
    }

    // Calculate the new score based on correctness and current level
    let newScore = quizState.score + (correct ? (quizState.level === "easy" ? 10 : quizState.level === "medium" ? 20 : 30) : 0);
    let newFeedback = correct ? "Correct!" : "Incorrect!"; // Provide feedback based on whether the answer was correct
    let newCorrectAnswers = correct ? quizState.correctAnswers + 1 : quizState.correctAnswers; // Increment correct answers count if correct
    let newIndex = quizState.currentQuestionIndex + 1; // Move to the next question index
    let newLevelPassed = false; // Track if the level is passed

    // Check if all questions in the level are answered
    if (newIndex < quizState.shuffledQuestions.length) {
      resetQuestionTimer(); // Reset the timer for the next question
    } else {
      // If all questions are answered, determine if the user passed the level
      if (newCorrectAnswers >= 2) { // Require at least 2 correct answers to pass the level
        newLevelPassed = true; // Mark the level as passed
        newFeedback = `Congratulations! You've passed the ${quizState.level} level with a total score of ${newScore}. Proceeding to the next level in ${countdown}...`;

        // If the "hard" level is completed, end the quiz
        if (quizState.level === "hard") {
          newFeedback = "Congratulations! You've completed all levels."; // Final feedback for completing the quiz
          clearProgress(); // Clear progress after completing the quiz
        }
      } else {
        // If the user did not pass the level
        newFeedback = `You did not pass the ${quizState.level} level. You can retry the level or restart the quiz.`;
        const updatedState = {
          ...quizState,    // Retain the previous state
          feedback: newFeedback, // Update with failure feedback
          levelFailed: true, // Mark the level as failed
          score: newScore,  // Update the score
        };
        saveProgress(updatedState); // Save the updated state to localStorage
        setQuizState(updatedState); // Update the quiz state
        return; // Exit the function early since the level failed
      }
    }

    // Update the quiz state with new values for the next step
    const updatedState = {
      ...quizState, // Retain the previous state
      currentQuestionIndex: newIndex < quizState.shuffledQuestions.length ? newIndex : 0, // Either move to the next question or reset if level is passed
      score: newScore, // Update the score
      userAnswer: "", // Clear the user's answer input for the next question
      feedback: newFeedback, // Provide feedback based on the result
      correctAnswers: newCorrectAnswers, // Update the number of correct answers
      levelFailed: false, // Reset the level failed flag
      levelPassed: newLevelPassed, // Set the level passed flag if applicable
    };

    saveProgress(updatedState); // Save the updated state to localStorage
    setQuizState(updatedState); // Update the quiz state with the new values
  };

  // Reset the question timer to the initial value
  const resetQuestionTimer = () => setQuestionTimer(15);

  // Retry the current level, resetting necessary state variables
  const retryLevel = () => {
    const updatedState = {
      ...quizState, // Retain the previous state
      currentQuestionIndex: 0, // Reset to the first question of the level
      correctAnswers: 0, // Reset the count of correct answers
      score: quizState.baseScore, // Reset score to the base score before the level started
      userAnswer: "", // Clear user's previous answer
      feedback: "", // Clear feedback
      levelFailed: false, // Reset the levelFailed flag
      levelPassed: false, // Reset the levelPassed flag
      shuffledQuestions: shuffleArray([...quizData[quizState.level]]) // Reshuffle questions for the retry
    };
    saveProgress(updatedState); // Save the updated state
    setQuizState(updatedState); // Update the quiz state
    setCountdown(3); // Reset the countdown timer
    resetQuestionTimer(); // Reset the question timer
  };

  // Proceed to the next level
  const proceedToNextLevel = () => {
    let newLevel;
    if (quizState.level === "easy") {
      newLevel = "medium"; // Move to the medium level
    } else if (quizState.level === "medium") {
      newLevel = "hard"; // Move to the hard level
    } else if (quizState.level === "hard") {
      onEnd(quizState.score); // End the quiz if the hard level is completed
      clearProgress(); // Clear progress when the quiz ends
      return;
    }

    const updatedState = {
      ...quizState, // Retain the previous state
      level: newLevel, // Update the level to the newly determined level
      currentQuestionIndex: 0, // Reset the question index to 0 for the new level
      correctAnswers: 0, // Reset the count of correct answers for the new level
      baseScore: quizState.score, // Set the baseScore to the current score before starting the new level
      userAnswer: "", // Clear the user's answer input
      feedback: "", // Clear any feedback messages
      levelFailed: false, // Reset the levelFailed flag for the new level
      levelPassed: false, // Reset the levelPassed flag for the new level
      shuffledQuestions: shuffleArray([...quizData[newLevel]]) // Shuffle and set the questions for the new level
    };

    saveProgress(updatedState); // Save the updated state to localStorage
    setQuizState(updatedState); // Update the quiz state with the new level
    setCountdown(3); // Reset the countdown timer to 3 seconds for the next level transition
    resetQuestionTimer(); // Reset the question timer for the new level
  };

  // Return all relevant state and functions to be used by the component
  return {
    quizState,
    currentQuestion,
    countdown,
    questionTimer,
    handleAnswerChange,
    handleSubmit,
    retryLevel,
    proceedToNextLevel,
  };
};

export default useQuiz;
