# Part 3

In this part our focus shifts towards the backend, that is, towards implementing functionality on the server side of the stack. We will implement a simple REST API in Node.js by using the Express library, and the application's data will be stored in a MongoDB database. At the end of this part, we will deploy our application to the internet.

## Middleware

Middleware perform actions during the request and response lifecycle.

```javascript
const express = require("express");
const morgan = require("morgan");

const app = express();

// Middleware to log requests
app.use(morgan("tiny"));

// Built-in middleware for parsing JSON requests
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
  console.log("Custom middleware executed");
  next();
});

app.get("/api/example", (req, res) => {
  res.send("Hello, middleware!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Hosting

There are numerous PaaS (Platform as a Service) options for hosting Node.js web apps.

First time?

```bash
brew install flyctl
fly auth signup
```

Already have an account?

```bash
fly auth login
```

Initialize an app by executing the following command in the root directory of the app:

```bash
fly launch --no-deploy
```

Deploy the app to fly.io servers whenever there are changes:

```bash
fly deploy
```

Open the app in the browser:

```bash
fly apps open
```

## Production Frontend

Build the front end for production by executing the following command in the frontend root directory:

```bash
npm run build
```

This will create a /dist directory that can be copied to the backend directory and added as a middleware:

```javascript
app.use(express.static("dist"));
```
