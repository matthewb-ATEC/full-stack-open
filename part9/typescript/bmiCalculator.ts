const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight / (height / 100) ** 2

  if (bmi < 18.5) {
    return 'Underweight range'
  } else if (bmi < 24.9) {
    return 'Normal range'
  } else if (bmi < 29.9) {
    return 'Overweight range'
  } else if (bmi >= 30.0) {
    return 'Obese range'
  } else {
    throw new Error('BMI not in range')
  }
}

try {
  console.log(calculateBmi(180, 74))
} catch (error: unknown) {
  if (error instanceof Error) console.log(error.message)
}
