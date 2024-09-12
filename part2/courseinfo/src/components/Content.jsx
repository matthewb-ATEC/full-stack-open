import Part from "./Part";
import Sum from "./Sum";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, id) => (
        <Part key={id} part={part} />
      ))}
      <Sum parts={parts} />
    </>
  );
};

export default Content;
