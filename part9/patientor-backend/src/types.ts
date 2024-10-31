import { z } from 'zod';
import { EntrySchema, NewPatientSchema } from './utils';

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
  entries: Entry[];
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type Entry = z.infer<typeof EntrySchema>;
