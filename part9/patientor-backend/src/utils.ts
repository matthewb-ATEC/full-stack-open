import { z } from 'zod';
import { Gender, NewPatient } from './types';

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

// Base schema for common properties
export const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().datetime(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

// Schemas for each specific entry type
export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.number().min(0).max(3),
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
    })
    .optional(),
});

export const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().datetime(),
    criteria: z.string(),
  }),
});

// Union schema for `Entry`
export const EntrySchema = z.union([
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

export default toNewPatient;
