const Sum = ({ parts }) => {
  console.log(parts);
  const sum = parts.reduce(
    (accumulator, part) => accumulator + part.exercises,
    0
  );
  return <strong>total of {sum} exercises</strong>;
};

export default Sum;
