import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION = 30;
const initalState = {
  questions: [],
  //loading , error , ready , active , finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payLoad,
        status: "ready",
      };
    case "dataFaild":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payLoad,
        points:
          action.payLoad === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      //finished exam
      if (state.index === 14)
        return {
          ...state,
          status: "finished",
          highScore:
            state.points > state.highScore ? state.points : state.highScore,
        };
      return { ...state, index: state.index + 1, answer: null };
    case "restart":
      return { ...initalState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finished" : state.status,
      };
    default:
      return;
  }
}

export default function App() {
  const [
    { status, questions, index, answer, points, highScore, secondRemaining },
    dispath,
  ] = useReducer(reducer, initalState);
  const numQueS = questions.length;
  const maxPoints = questions.reduce((prv, curr) => prv + curr.points, 0);
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispath({ type: "dataReceived", payLoad: data }))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQueS={numQueS} dispath={dispath} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQueS}
              index={index}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispath={dispath}
            />
            <Footer>
              <Timer secondRemaining={secondRemaining} dispath={dispath} />
              <NextButton
                dispath={dispath}
                answer={answer}
                index={index}
                numQuestions={numQueS}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispath={dispath}
          />
        )}
      </Main>
    </div>
  );
}
