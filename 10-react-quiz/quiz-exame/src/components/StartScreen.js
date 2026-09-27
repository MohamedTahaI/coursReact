function StartScreen({ numQueS, dispath }) {
  return (
    <div className="start">
      <h2> welcome to The React Quiz! </h2>
      <h3> {numQueS} questions to test your React mastery </h3>
      <button className="btn btn-ui" onClick={() => dispath({ type: "start" })}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
