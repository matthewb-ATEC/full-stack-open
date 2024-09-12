import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, id) => (
        <Part jey={id} part={part} />
      ))}
    </>
  );
};

export default Content;
