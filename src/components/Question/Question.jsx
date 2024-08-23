import React from "react";
import TrueFalse from '../../elements/TrueFalse/TrueFalse'
import MultipleChoice from '../../elements/MultipleChoice/MultipleChoice'
import TextInput from '../../elements/TextInput/TextInput'

const Question = ({ question, userAnswer, onAnswerChange }) => {
  // Render the appropriate question type component based on the question type
  switch (question.type) {
    case "multiple-choice":
      return (
        <MultipleChoice
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    case "true-false":
      return (
        <TrueFalse
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    case "text-input":
      return (
        <TextInput
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    default:
      return null;
  }
};

export default Question;
