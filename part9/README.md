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
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

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
})
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
