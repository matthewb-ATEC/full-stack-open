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
