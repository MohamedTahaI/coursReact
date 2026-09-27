function FinishScreen({ points, maxPoints, highScore, dispath }) {
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🎖️";
  else if (percentage >= 80) emoji = "🎉";
  else if (percentage >= 60) emoji = "🎉";
  else if (percentage >= 0) emoji = "🤔";
  else emoji = "🙅‍♀️";
  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore"> Highsocre : {highScore} points</p>
      <button
        className="btn btn-ui"
        onClick={() => dispath({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
