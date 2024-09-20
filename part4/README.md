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
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

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
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 'off',
    },
  },
  { 
    ignores: ["dist/**", "build/**"],
  },
]
```