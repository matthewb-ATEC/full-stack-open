interface ExerciseResults {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  targetAmount: number;
  dailyExerciseHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const dailyExerciseHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const exerciseHour = Number(args[i]);
    if (isNaN(exerciseHour)) {
      throw new Error('Provided values were not numbers!');
    }
    dailyExerciseHours.push(exerciseHour);
  }

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      targetAmount: Number(args[2]),
      dailyExerciseHours: dailyExerciseHours,
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateExercises = (
  dailyExerciseHours: number[],
  targetAmount: number
): ExerciseResults => {
  const totalDays: number = dailyExerciseHours.length;
  const trainingDays: number = dailyExerciseHours.filter(
    (hours) => hours != 0
  ).length;
  let totalHours: number = 0;
  dailyExerciseHours.forEach((hours: number) => {
    totalHours += hours;
  });
  const averageHours: number = totalHours / totalDays;
  const success: boolean = averageHours >= targetAmount;

  const rating: number = success ? 3 : averageHours > targetAmount / 2 ? 2 : 1;
  const ratingDescription: string =
    rating === 3
      ? 'goal achieved'
      : rating === 2
      ? 'not too bad but could be better'
      : 'goal failed';

  const exerciseExerciseResults: ExerciseResults = {
    periodLength: totalDays,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: targetAmount,
    average: averageHours,
  };
  return exerciseExerciseResults;
};

if (require.main === module) {
  try {
    const { targetAmount, dailyExerciseHours } = parseExerciseArguments(
      process.argv
    );
    console.log(calculateExercises(dailyExerciseHours, targetAmount));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateExercises;
