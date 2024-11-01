import { z } from 'zod';
import {
  BaseEntrySchema,
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  NewPatientSchema,
  OccupationalHealthcareEntrySchema,
} from './utils';

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
  entries?: Entry[];
};

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type Entry =
  | OccupationalHealthcareEntry
  | HospitalEntry
  | HealthCheckEntry;

export type BaseEntry = z.infer<typeof BaseEntrySchema>;
export type OccupationalHealthcareEntry = z.infer<
  typeof OccupationalHealthcareEntrySchema
>;
export type HospitalEntry = z.infer<typeof HospitalEntrySchema>;
export type HealthCheckEntry = z.infer<typeof HealthCheckEntrySchema>;
/*{
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}*/
/*
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: Discharge;
}

export interface Discharge {
  date: string;
  criteria: string;
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}*/
