import { z } from 'zod';
import { NewPatientSchema } from './utils';

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
};

export type NonSensitivePatient = Omit<Patient, 'ssn'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
