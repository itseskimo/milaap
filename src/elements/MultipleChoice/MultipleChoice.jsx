import React from "react";
import './MultipleChoice.css'

const MultipleChoice = React.memo(({ question, userAnswer, onAnswerChange }) => (
  <div className="question-container">
    <p>{question.question}</p>

    <div className="answerfield-container">
      {/* Render the multiple-choice options as radio buttons */}
      {question.options.map((option) => (
        <label key={option} className="answerfield">
          <input
            type="radio"
            name="answer"
            value={option}
            checked={userAnswer === option}
            onChange={(e) => onAnswerChange(e.target.value)}
          />
          {option}
        </label>
      ))}
    </div>

  </div>
));

export default MultipleChoice;
