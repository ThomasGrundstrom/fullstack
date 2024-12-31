import patientData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import {v4 as uuidv4} from 'uuid';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuidv4(),
    ...patient,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | string => {
  const patient = patients.find(patient => patient.id === id);
  if (patient) {
    return patient;
  }
  return `No patients found with id ${id}`;
};

export default {
  getPatients,
  addPatient,
  getNonSensitivePatients,
  getPatientById
};