import { useEffect } from "react";

function Timer({ dispath, secondRemaining }) {
  const mins = Math.floor(secondRemaining / 60);
  const seconds = secondRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispath({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispath],
  );

  return (
    <div className="timer ">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
