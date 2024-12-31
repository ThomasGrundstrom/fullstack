import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Male, Female, Transgender } from '@mui/icons-material';

interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;

  diagnosisCodes?: Array<Diagnosis['code']>;
}

enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

interface Discharge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: Discharge;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave;
}

type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: string;
  occupation: string;
  entries: Entry[];
}

interface GenderProps {
  gender: string;
}

const GenderIcon = ({ gender }: GenderProps) => {
  switch (gender) {
    case 'male':
      return <Male />;
    case 'female':
      return <Female />;
    case 'other':
      return <Transgender />;
    default:
      return null;
  }
};

const IndividualPatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patientInfo, setPatientInfo] = useState<Patient>();

  useEffect(() => {
    id && axios.get(`http://localhost:3001/api/patients/${id}`).then(response => {
      setPatientInfo(response.data);
    });
  }, [id]);

  return (
    patientInfo ? (
      <div>
        <h1>
          {patientInfo.name} <GenderIcon gender={patientInfo.gender} />
        </h1>
        born: {patientInfo.dateOfBirth}
        <br />
        ssn: {patientInfo.ssn}
        <br />
        occupation: {patientInfo.occupation}
        <br />
        <h2>Entries</h2>
        {patientInfo.entries.length > 0 ? (
          patientInfo.entries.map(entry => (
            <div key={entry.id}>
              {entry.date} <i>{entry.description}</i>
              <br />
              <ul>
              {entry.diagnosisCodes?.map(code => (
                <li key={code}>{code}</li>
              ))}
              </ul>
            </div>
          ))
        ) : (
          <p>
            No entries
          </p>
        )}
      </div>
    ) : (
      <div>
        Loading...
      </div>
    )
  );
};

export default IndividualPatientInfo;