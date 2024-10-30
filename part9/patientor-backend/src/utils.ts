import { z } from 'zod';
import { Gender, NewPatient } from './types';

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export default toNewPatient;
