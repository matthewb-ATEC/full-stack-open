import { Router, Response } from 'express';
import { NonSensitivePatient } from '../types';
import patientsService from '../services/patientsService';
import toNewPatient from '../utils';
const patientsRouter = Router();

patientsRouter.get(
  '/',
  (_request, response: Response<NonSensitivePatient[]>) => {
    response.status(200).send(patientsService.getNonSensitivePatients());
  }
);

patientsRouter.post('/', (request, response) => {
  try {
    const newPatient = toNewPatient(request.body);
    const addedPatient = patientsService.addPatient(newPatient);
    response.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    response.status(400).send(errorMessage);
  }
});

export default patientsRouter;
