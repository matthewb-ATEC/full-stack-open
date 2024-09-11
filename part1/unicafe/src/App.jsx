import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => {
    console.log("increasing good");
    setGood(good + 1);
  };

  const handleNeutral = () => {
    console.log("increasing nuetral");
    setNeutral(neutral + 1);
  };

  const handleBad = () => {
    console.log("increasing bad");
    setBad(bad + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>

      <Button text={"good"} onClick={handleGood} />
      <Button text={"nuetral"} onClick={handleNeutral} />
      <Button text={"bad"} onClick={handleBad} />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = all > 0 ? (good - bad) / all : 0;
  const percent =
    all > 0 ? (neutral + bad === 0 ? 100 : (good / all) * 100) : 0;

  return (
    <>
      <h1>statistics</h1>

      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>

      <p>all {all}</p>
      <p>average {average}</p>
      <p>percent {percent} %</p>
    </>
  );
};

export default App;
