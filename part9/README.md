# Part 9

In this part, we will be using the tools previously introduced to build end-to-end features to an existing ecosystem, with predefined linters and an existing codebase, while writing TypeScript. After doing this part, you should be able to understand, develop and configure projects using TypeScript.

## Installing Typescript

To install typescript globally use the following command:

```bash
npm install --location=global ts-node typescript
```

To install typescript locally in a new project:

```bash
npm init
npm install --save-dev ts-node typescript
```

```javascript
{
  // ..
  "scripts": {
    "ts-node": "ts-node"
  },
  // ..
}
```

Run it with:

```bash
npm run ts-node file.ts -- -s --someoption
```

## Types

You can install typescript versions of libraries from the @types organization within npm:

```bash
npm install --save-dev @types/react @types/express @types/lodash @types/jest @types/mongoose
```

## Express with Typescript

Install express and ts-node-dev so updates happen in dev mode.

```bash
npm install express
npm install --save-dev @types/express
npm install --save-dev ts-node-dev
```

Add scripts to package.json to run the express server in dev mode:

```javascript
{
  // ...
  "scripts": {
    // ...
    "start": "ts-node index.ts",
    "dev": "ts-node-dev index.ts",
  },
  // ...
}
```

Define the settings of the tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

## ESlint with Typescript

Install:

```bash
npm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
npm install --save-dev @stylistic/eslint-plugin
```

eslint.config.mjs:

```mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
});
```

package.json

```json
{
  // ...
  "scripts": {
      // ...
      "lint": "eslint ."
      //  ...
  },
  // ...
}s
```

## Starting from scratch

Start a new node project, install typscript, define a script to execute the typscript compiler, then run the compiler to generate the tsconfig.json

```bash
npm init
npm install typescript --save-dev
```

```json
{
  // ..
  "scripts": {
    "tsc": "tsc"
  }
  // ..
}
```

```bash
npm run tsc -- --init
```

_Note_ the extra -- before the actual argument! Arguments before -- are interpreted as being for the npm command, while the ones after that are meant for the command that is run through the script

Ensure the following settings are active/uncommented

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true
  }
}
```

Install express, express types, and eslint

```bash
npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express @types/eslint__js
```

Set the eslint.config.mjs:

```mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@stylistic': stylistic,
  },
  ignores: ['build/*'],
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
});
```

Install ts-node-dev to update our code live as we save:

```bash
npm install --save-dev ts-node-dev
```

package.json

```json
{
  // ...
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint .",
    "start": "node build/index.js"
  }
  // ...
}
```

## Utility Types

We can create subtypes of custom types to specify the expected data type. Use Pick to select fields to include in the new type, or Omit to exclude types in the utility type.

```typescript
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

// The following define the same type
export type NonSensitiveDiaryEntry = Pick<
  DiaryEntry,
  'id' | 'date' | 'weather' | 'visibility'
>[];
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
```

Despite omitting comment from the DiaryEntry type, if we recieve data with the comment field that data will be leaked to the browser unless we return a new object with only the desired fields:

```typescript
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility,
  }));
};
```

## Typing the Request and Response

By default the response type allows for bodies of any type, which can be specified to restrict the valid data types.

```typescript
import { Response } from 'express';
// ...
router.get('/', (_req, res: Response<DiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries());
});
```

## Zod

Zod is a package that can be used to narrow types of values which is especially useful when handling POST requests. The following defines a schema that narrows the types of the listed fields, infers a type from the object schema, and extends the type to include the id.

```typescript
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
  id: string;
}
```

We can create an use middleware to parse these objects into this schema as follows:

```typescript
import { Request, Response, NextFunction } from 'express';
import { NewPatient, Patient } from '../types';
import patientsService from '../services/patientsService';
import { NewPatientSchema } from '../utils';

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
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
```
