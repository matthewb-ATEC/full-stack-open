# Part 7

The seventh part of the course touches on several different themes. First, we'll get familiar with React Router. React Router helps us divide the application into different views that are shown based on the URL in the browser's address bar. After this, we'll look at a few more ways to add CSS styles to React applications. During the entire course, we've used Vite to build all of our applications. It is also possible to configure the whole toolchain yourself, and in this part we will see how this can be done with a tool called Webpack. We shall also have a look at hook functions and how to define a custom hook.

## React Router

Change the content of single page applications based on the URL in the browser.

```bash
npm install react-router-dom
```

Establish routes:

```javascript
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

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
  )
}
```

### Parameterized Route

Use parameters in URLs.

```javascript
const Notes = ({notes}) => (
  <div>
    {notes.map(note =>
        <div key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </div>
    )}
  </div>
)
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
<Route path="/users" element={user ? <Users /> : <Navigate replace to="/login" />} />
```

### useMatch

You can extract parameterized values from the URL and pass the appropriate props from the Router level of the application.

```javascript
import {
  // ...
  useMatch
} from 'react-router-dom'

const App = () => {
  // ...
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(note => note.id === Number(match.params.id))
    : null

  return (
    <div>
      // ...
      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        // ...
      </Routes>
    </div>
  )
}  
```