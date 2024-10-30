import { Router, Response } from 'express';
import { Diagnosis } from '../types';
import diagnosesService from '../services/diagnosesService';
const diagnosesRouter = Router();

diagnosesRouter.get('/', (_request, response: Response<Diagnosis[]>) => {
  response.status(200).send(diagnosesService.getDiagnoses());
});

export default diagnosesRouter;
