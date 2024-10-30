import { Router, Response } from 'express';
import { NonSensitivePatient } from '../types';
import patientsService from '../services/patientsService';
const patientsRouter = Router();

patientsRouter.get(
  '/',
  (_request, response: Response<NonSensitivePatient[]>) => {
    response.status(200).send(patientsService.getNonSensitivePatients());
  }
);

export default patientsRouter;
