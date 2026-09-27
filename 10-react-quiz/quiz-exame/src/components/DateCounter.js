import { useReducer } from "react";
const instialState = { count: 0, step: 1 };

function DateCounter() {
  function reduce(state, action) {
    switch (action.type) {
      case "dec":
        return { ...state, count: state.count - state.step };
      case "inc":
        return { ...state, count: state.count + state.step };
      case "setCount":
        return { ...state, count: action.payLoad };
      case "setStep":
        return { ...state, step: action.payLoad };
      case "rest":
        return instialState;
      default:
        return;
    }
  }

  const [state, ditph] = useReducer(reduce, instialState);

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + state.count);

  const dec = function () {
    ditph({ type: "dec" });
  };

  const inc = function () {
    ditph({ type: "inc" });
  };

  const defineCount = function (e) {
    ditph({ type: "setCount", payLoad: Number(e.target.value) });
  };

  const defineStep = function (e) {
    ditph({ type: "setStep", payLoad: Number(e.target.value) });
  };

  const reset = function () {
    ditph({ type: "rest" });
    // ditph({ type: "setCount", payLoad: 0 });
    // ditph({ type: "setStep", payLoad: 1 });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={state.step}
          onChange={defineStep}
        />
        <span>{state.step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={state.count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
