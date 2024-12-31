import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises, { RequestBody } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;
  if (height && weight) {
    if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
      const result = calculateBmi(Number(height), Number(weight));
      res.send(result);
    } else {
      res.status(400).json({error: 'malformatted parameters'});
    }
  } else {
    res.status(400).json({error: 'malformatted parameters'});
  }
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body as RequestBody;
  if (daily_exercises && target) {
    if (
      !isNaN(Number(target)) &&
      Array.isArray(daily_exercises) &&
      daily_exercises.every(item => !isNaN(Number(item)))
    ) {
      const daily_exercises_as_numbers = daily_exercises.map(Number);
      const result = calculateExercises(daily_exercises_as_numbers, Number(target));
      res.send(result);
    } else {
      res.status(400).json({error: 'malformatted parameters'});
    }
  } else {
    res.status(400).json({error: 'missing parameters'});
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});