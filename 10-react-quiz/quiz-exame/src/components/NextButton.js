function NextButton({ dispath, answer, index, numQuestions }) {
  if (answer === null) return null;
  return (
    <button
      className="btn btn-ui"
      onClick={() => dispath({ type: "nextQuestion" })}
    >
      {index === numQuestions - 1 ? "Finish" : "Next"}
    </button>
  );
}

export default NextButton;
