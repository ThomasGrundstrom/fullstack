import express, { Response, Request, NextFunction } from 'express';
import patientService from '../services/patientService';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
import { newPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (
  _req: Request,
  res: Response<NonSensitivePatient[]>
) => {
  res.send(patientService.getNonSensitivePatients());
});

const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => { 
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (
  req: Request<unknown, unknown, NewPatient>,
  res: Response<Patient>
) => {
  const addedPatient = patientService.addPatient(req.body);
  res.json(addedPatient);
});

router.use(errorMiddleware);

router.get('/:id', (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  res.send(patientService.getPatientById(id));
});

export default router;