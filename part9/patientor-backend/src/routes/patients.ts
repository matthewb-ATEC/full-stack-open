import { Router, Request, Response, NextFunction } from 'express';
import { NewPatient, NonSensitivePatient, Patient } from '../types';
import patientsService from '../services/patientsService';
import { z } from 'zod';
import { NewPatientSchema } from '../utils';
const patientsRouter = Router();

patientsRouter.get(
  '/',
  (_request, response: Response<NonSensitivePatient[]>) => {
    response.status(200).send(patientsService.getNonSensitivePatients());
  }
);

patientsRouter.get(
  '/:id',
  (request, response: Response<NonSensitivePatient>) => {
    const id: string = request.params.id;
    const patient: NonSensitivePatient | undefined =
      patientsService.getNonSensitivePatientById(id);

    if (patient) response.status(200).send(patient);
    else response.status(404);
  }
);

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

patientsRouter.post(
  '/',
  newPatientParser,
  (
    request: Request<unknown, unknown, NewPatient>,
    response: Response<Patient>
  ) => {
    const addedPatient = patientsService.addPatient(request.body);
    response.json(addedPatient);
  }
);

patientsRouter.use(errorMiddleware);

export default patientsRouter;
