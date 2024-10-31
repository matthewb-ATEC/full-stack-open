import { z } from 'zod';
import { Gender, NewPatient } from './types';

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const EntrySchema = z.object({
  description: z.string(),
  creationDate: z.string().date(),
  creator: z.string(),
  diagnosisCodes: z.array(z.string()),
});

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

export default toNewPatient;
