interface BmiValues {
  height: number
  weight: number
}

const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments')
  if (args.length > 4) throw new Error('Too many arguments')

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

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
  const { height, weight } = parseBmiArguments(process.argv)
  console.log(calculateBmi(height, weight))
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message
  }
  console.log(errorMessage)
}
