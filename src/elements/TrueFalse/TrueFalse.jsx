import React from "react";

const TrueFalse = React.memo(({ question, userAnswer, onAnswerChange }) => (
  <div className="question-container">
    <p>{question.question}</p>
    {/* Render true/false options as radio buttons */}
    <label className="answerfield">
      <input
        type="radio"
        name="answer"
        value="true"
        checked={userAnswer === "true"}
        onChange={(e) => onAnswerChange(e.target.value)}
      />
      True
    </label>
    <label className="answerfield">
      <input
        type="radio"
        name="answer"
        value="false"
        checked={userAnswer === "false"}
        onChange={(e) => onAnswerChange(e.target.value)}
      />
      False
    </label>
  </div>
));

export default TrueFalse;
