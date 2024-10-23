# Part 7

The seventh part of the course touches on several different themes. First, we'll get familiar with React Router. React Router helps us divide the application into different views that are shown based on the URL in the browser's address bar. After this, we'll look at a few more ways to add CSS styles to React applications. During the entire course, we've used Vite to build all of our applications. It is also possible to configure the whole toolchain yourself, and in this part we will see how this can be done with a tool called Webpack. We shall also have a look at hook functions and how to define a custom hook.

## React Router

Change the content of single page applications based on the URL in the browser.

```bash
npm install react-router-dom
```

Establish routes:

```javascript
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div>
        <Link to="/">home</Link>
        <Link to="/notes">notes</Link>
        <Link to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};
```

### Parameterized Route

Use parameters in URLs.

```javascript
const Notes = ({ notes }) => (
  <div>
    {notes.map((note) => (
      <div key={note.id}>
        <Link to={`/notes/${note.id}`}>{note.content}</Link>
      </div>
    ))}
  </div>
);
```

```javascript
<Router>
  // ...
  <Routes>
    <Route path="/notes/:id" element={<Note notes={notes} />} />
    // ...
  </Routes>
</Router>
```

Extract parameters from URLs to component variables:

```javascript
import {
  // ...
  useParams
} from 'react-router-dom'

const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))
  return (
    // ...
  )
}
```

### useNavigate

Programmatically set the browser's URL:

```javascript
import {
  // ...
  useNavigate
} from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate()
  const onSubmit = (event) => {
    // ...
    navigate('/')
  }

  return (
    // ...
  )
}
```

### Redirect

Conditionally set the element displayed by a route by replacing the navigation destination:

```javascript
<Route
  path="/users"
  element={user ? <Users /> : <Navigate replace to="/login" />}
/>
```

### useMatch

You can extract parameterized values from the URL and pass the appropriate props from the Router level of the application.

```javascript
import {
  // ...
  useMatch,
} from "react-router-dom";

const App = () => {
  // ...
  const match = useMatch("/notes/:id");
  const note = match
    ? notes.find((note) => note.id === Number(match.params.id))
    : null;

  return (
    <div>
      // ...
      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        // ...
      </Routes>
    </div>
  );
};
```

## Hooks

Hooks are functions typically provided by React that begin with the word 'use'. Exmaples include useState, useEffect, useImperativeHandler, useReducer, useContext, etc. Hooks cannot be used inside of loops or conditional statments. The following ESLint plugin can ensure that hooks are used correctly:

```bash
npm install eslint-plugin-react-hooks
```

### Custom Hooks

Building your own Hooks lets you extract component logic into reusable functions.

```javascript
const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};
```

```javascript
const App = () => {
  const name = useField("text");
  // ...
  return (
    <div>
      <form>
        <input {...name} />
        // ...
      </form>
    </div>
  );
};
```

## UI Libraries

Boostrap and Material UI offer ready made styled elements to speed up front end development.

### Bootstrap

Install with the following command:

```bash
npm install react-bootstrap
```

Update the public/index.html file's head section:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
    crossorigin="anonymous"
  />
  // ...
</head>
```

### Material UI

Install:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Render all components within the app in a container:

```javascript
import { Container } from "@mui/material";

const App = () => {
  // ...
  return <Container>// ...</Container>;
};
```

Table:

```javascript
const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>

    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>{note.user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
```

Forms:

```javascript
const Login = (props) => {
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    props.onLogin("mluukkai");
    navigate("/");
  };

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username" />
        </div>
        <div>
          <TextField label="password" type="password" />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  );
};
```

Notifications:

```javascript
<Alert variant="success">{message}</Alert>
```

Navigation:

```javascript
<AppBar position="static">
  <Toolbar>
    <Button color="inherit" component={Link} to="/">
      home
    </Button>
    <Button color="inherit" component={Link} to="/notes">
      notes
    </Button>
    <Button color="inherit" component={Link} to="/users">
      users
    </Button>
    {user ? (
      <em>{user} logged in</em>
    ) : (
      <Button color="inherit" component={Link} to="/login">
        login
      </Button>
    )}
  </Toolbar>
</AppBar>
```

## Webpack

Webpack is a popular JavaScript module bundler used to bundle and optimize code for web applications.

```bash
npm install --save-dev webpack webpack-cli
```

### Bundling

Combines multiple JavaScript modules into a single file for better performance in browsers.

### Configuration File

Defines how the bundler should handle code transformations and outputs.

### Bundling React

Bundles React applications by processing JSX and other modern JavaScript syntax into browser-friendly code.

### Loader

Used to preprocess files (e.g., JSX, CSS) before bundling.

### Transpilers

Convert modern JavaScript (e.g., ES6, JSX) into older syntax for better browser compatibility.

### CSS

Use style-loader and css-loader to bundle CSS files into your JavaScript.

### Webpack Dev Server

Automates reloading, offering a smoother development workflow by serving the app locally.

### Source Maps

Maps errors from bundled code back to the original source for easier debugging.

### Minification

Optimizes bundle size by removing unnecessary characters and shortening variable names.

### Environments

Switch between development and production configurations based on the environment.

### Polyfill

Adds missing functionality to older browsers.

## Synchronizing the Client and Server

To ensure that the front end is up to date with any changes occuring in the server we can use the socket.io library.

## Security

### Injection

Injection attacks are a result of malicious code being executed from user input. Prevent this with parameterized queries and sanitization.

### Cross Site Scripting

Scripts are input by users and executed. React sanitizes variables.

### Installing Security Patches

Check the version of your dependencies versus the latest version by running:

```bash
npm outdated --depth 0
```

Install the following package to easily update dependencies:

```bash
npm install -g npm-check-updates
```

Execute the installed package:

```bash
npm-check-updates
```

Update package.json:

```bash
ncu -u
```

Finally update the dependencies:

```bash
npm install
```

### Helmet

Helmet is a backend middleware that eliminates some security vulnerabilities

```bash
npm install helmet
```

```javascript
import express from "express";
import helmet from "helmet";

const app = express();

// Use Helmet!
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(8000);
```

### ESlint Security Plugin

```bash
npm install eslint-security-plugin
```

## Microservice Architecture

Breaking up the backend into independent servers and databases that have their own endpoints.
