const Sum = ({ parts }) => {
  console.log(parts);
  const sum = parts.reduce((accumulator, part) => {
    console.log("accumulator: ", accumulator, "part: ", part);
    return accumulator + part.exercises;
  }, 0);
  return <strong>total of {sum} exercises</strong>;
};

export default Sum;
