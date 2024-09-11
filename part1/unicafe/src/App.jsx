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
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  );
};

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

export default App;
