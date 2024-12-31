const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);
  const categories = [
    {upper: 16, message: 'Underweight (Severe thinness)'},
    {upper: 17, message: 'Underweight (Moderate thinness)'},
    {upper: 18.5, message: 'Underweight (Mild thinness)'},
    {upper: 25, message: 'Normal range'},
    {upper: 30, message: 'Overweight (Pre-obese)'},
    {upper: 35, message: 'Overweight (Class I)'},
    {upper: 40, message: 'Overweight (Class II)'}
  ];

  const result = categories.find(category => bmi < category.upper)?.message || 'Overweight (Class III)';
  return result;
};

const parseBmiArguments = (args: string[]): number[] => {
  if (args.length < 4) throw new Error('Not enought arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return [Number(args[2]), Number(args[3])];
  } else {
    throw new Error('Provided values were not numbers');
  };
};

if (require.main === module) {
  try {
    const [height, weight] = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ` Error: ${error.message}`;
    }
    console.log(errorMessage);
  };
};

export default calculateBmi;