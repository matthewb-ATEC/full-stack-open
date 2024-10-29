interface results {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

const calculateExercises = (
  dailyExerciseHours: number[],
  targetAmount: number
): results => {
  const totalDays: number = dailyExerciseHours.length
  const trainingDays: number = dailyExerciseHours.filter(
    (hours) => hours != 0
  ).length
  let totalHours: number = 0
  dailyExerciseHours.forEach((hours: number) => {
    totalHours += hours
  })
  const averageHours: number = totalHours / totalDays
  const success: boolean = averageHours >= targetAmount

  const rating: number = success ? 3 : averageHours > targetAmount / 2 ? 2 : 1
  const ratingDescription: string =
    rating === 3
      ? 'goal achieved'
      : rating === 2
      ? 'not too bad but could be better'
      : 'goal failed'

  const exerciseResults: results = {
    periodLength: totalDays,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: targetAmount,
    average: averageHours,
  }
  return exerciseResults
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
