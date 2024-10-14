# Part 4

In this part, we will continue our work on the backend. Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

## Backend initialization

```bash
npm init
npm install
npm install express
npm install cors
npm install dotenv
npm install --save-dev nodemon
npm update

fly auth login
fly launch --no-deploy
# add PORT to fly.toml
fly deploy

npm install mongoose
fly secrets set MONGODB_URI=VALUE

npm install eslint @eslint/js --save-dev
npx eslint --init
npm install --save-dev @stylistic/eslint-plugin-js
```

Add scripts to package.json:

```json
//...
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint ."
}
//...
```

Repalce eslint.config.mjs contents:

```mjs
import globals from "globals";
import stylisticJs from "@stylistic/eslint-plugin-js";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "unix"],
      "@stylistic/js/quotes": ["error", "single"],
      "@stylistic/js/semi": ["error", "never"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
  },
  {
    ignores: ["dist/**", "build/**"],
  },
];
```

## Testing

Create helper functions in the utils/ directory and test them using test files in the tests/ directory.
Use the command:

```bash
npm run test
```

or

```bash
node --test
```

to run the tests.

Test files use the following naming convention:

```bash
functionName.test.js
```

The structure of a test file is as follows:

```javascript
const { test, describe } = require("node:test");
const assert = require("node:assert");
const helper = require("../utils/helper");

describe("suite description", () => {
  // test data declarations...

  test("test name", () => {
    const result = helper.testFunction(testData);

    // Use strictEqual when comparing values
    assert.strictEqual(result, 0);

    // Use deepStrictEqual when comparing the values of objects
    assert.deepStrictEqual(result, {});
  });

  // additional tests...
});
```

### Testing Environment

Run tests with a different confirguation from production during development.
Create a cross platform compatible test environment with the _cross_env_ package. Modify the package.json scripts to set the environment as follows:

```bash
npm install cross-env
```

```json
{
  // ...
  "scripts": {
    "start": "cross-env NODE_ENV=production node index.js",
    "dev": "cross-env NODE_ENV=development nodemon index.js",
    "test": "cross-env  NODE_ENV=test node --test"
    // ...
  }
  // ...
}
```

Run tests through the app on a different port than your produciton app using supertest

```bash
npm install --save-dev supertest
```

```javascript
const { test, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
```

### Running Tests

You can either run every test, specific tests by name, or tests that contain a pattern.

```bash
npm run test
npm test -- tests/note_api.test.js
npm test -- --test-name-pattern="the first note is about HTTP methods"
```

### Async/Await Error Handling

To avoid using try catch blocks in async/await operations use the following package:

```bash
npm install express-async-errors
```

Be sure to use the installed package by updating the app.js file to include the following before any route imports:

```javascript
require("express-async-errors");
```

### Intializing Test Database

When using a separate database for testing it may be necessary to populate data before running a test. This can be accomplished with the beforeEach function from the node:test library. It can either add all documents in parallel or in order as seen below:

```javascript
// Execute in parallel
beforeEach(async () => {
  await Note.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

// Execute in order
beforeEach(async () => {
  await Note.deleteMany({});

  for (let note of helper.initialNotes) {
    let noteObject = new Note(note);
    await noteObject.save();
  }
});
```

## Users

Users can be stored in a separate collection in the mongo database. Users can reference a list of notes thy've create, notes can reference the user that created them, or both.

### Hashing Passwords

Hash passwords with the following package:

````bash
npm install brypt
```

bcrypt is a hashing algorithm thats intentionally slow to counter brute force password crackers.

### Token Authentication

Users will receive a generated token when they login successfully which will be passed along with each request.

Generate tokens with the following package:

```bash
npm install jsonwebtoken
````
