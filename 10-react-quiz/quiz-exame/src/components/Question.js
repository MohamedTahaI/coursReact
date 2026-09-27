function Question({ question, answer, dispath }) {
  console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>
      <div className="options">
        {question.options.map((option, index) => (
          <Button
            question={question}
            key={option}
            op={option}
            dispath={dispath}
            index={index}
            answer={answer}
          />
        ))}
      </div>
    </div>
  );
}

function Button({ op, dispath, index, answer, question }) {
  const hasAnswered = answer !== null;
  return (
    <button
      className={`btn btn-option ${index === answer ? "answer" : ""} ${
        hasAnswered
          ? index === question.correctOption
            ? "correct"
            : "wrong"
          : ""
      }`}
      onClick={() => dispath({ type: "newAnswer", payLoad: index })}
      disabled={hasAnswered}
    >
      {op}
    </button>
  );
}
export default Question;
