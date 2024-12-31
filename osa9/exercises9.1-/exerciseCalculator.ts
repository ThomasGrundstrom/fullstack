interface ExerciseResult {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const calculateExercises = (exercises: number[], target: number): ExerciseResult => {
  const trainingDays = exercises.filter(exercise => exercise > 0);
  const sum = exercises.reduce((a, b) => a + b, 0);
  const avg = (sum / exercises.length) || 0;

  const calculateRating = () => {
    let rating = 1;
    if (trainingDays.length >= exercises.length / 2) {
      rating += 1;
    }
    if (avg >= target) {
      rating += 1;
    }

    let description = '';
    if (rating === 1) {
      description = 'You can do better than that';
    } else if (rating === 2) {
      description = 'Not too bad but could be better';
    } else {
      description = 'Pretty good';
    }

    return {
      rating: rating,
      description: description
    };
  };

  const ratingAndDescription = calculateRating();

  return {
    periodLength: exercises.length,
    trainingDays: trainingDays.length,
    success: avg >= target,
    rating: ratingAndDescription.rating,
    ratingDescription: ratingAndDescription.description,
    target: target,
    average: avg
  };
};

const parseExerciseArguments = (args: string[]): [number[], number] => {
  if (args.length < 4) throw new Error('Not enought arguments');

  const [, , ...rest] = args;

  if (rest.find((arg) => isNaN(Number(arg)))) {
    throw new Error('Provided values were not numbers');
  }
  
  const numbers: number[] = rest.map(Number);
  const done = numbers.slice(1);
  const goal = numbers[0];
  return [done, goal];
};

if (require.main === module) {
  try {
    const [done, goal] = parseExerciseArguments(process.argv);
    console.log(calculateExercises(done, goal));
  } catch (error) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    console.log(errorMessage);
  }
};

export interface RequestBody {
  daily_exercises: number[] | string[],
  target: number | string
}

export default calculateExercises;