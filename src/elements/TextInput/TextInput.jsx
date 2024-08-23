import React from "react";
import './TextInput.css'

const TextInput = React.memo(({ question, userAnswer, onAnswerChange }) => (
  <div className="question-container">
    <p>{question.question}</p>
    {/* Render the input field for text-based answers */}
    <input
      type="text"
      value={userAnswer}
      autoFocus
      onChange={(e) => onAnswerChange(e.target.value)}
    />
  </div>
));

export default TextInput;
