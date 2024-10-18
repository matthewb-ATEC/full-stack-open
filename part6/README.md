# Part 6

So far, we have placed the application's state and state logic directly inside React components. When applications grow larger, state management should be moved outside React components. In this part, we will introduce the Redux library, which is currently the most popular solution for managing the state of React applications.

We'll learn about the lightweight version of Redux directly supported by React, namely the React context and useReducer hook, as well as the React Query library that simplifies the server state management.

## Redux

### Store

In Redux, the state of the entire application is stored in on javascript object in the store. The state can be retrieved using the getStore() function.

```javascript
store.getState()
```

### Actions

Modify the state of thes store with actions. Actions can have a type and a payload, but some only require a type.

```javascript
{
    type: 'INCREMENT'
}
```

Execute actions on the store by dispatching them.

```javascript
store.dispatch({ type: 'INCREMENT' })
```

### Reducers

The impact of the action type is defined using a reducer. Reducers take in the current state and an action and return the new state. Reducers must be pure functions, meaning they return the same value when provided the same parameters.

```javascript
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}
```

Reducers should never be called directly. Reducers are passed to the store upon creation.

```javascript
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  // ...
}

const store = createStore(counterReducer)
```

Reducers can be stored in their own directory src/reducers/counterReducer.js

### Subscribing

Subscribing to the store creates a callback method that will execute whenever an action is dispatched to the store.

```javascript
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

### Action Creators

Functions that create actions are called action creators. These functions can be isolated from react components into their related reducer's file.

```javascript
// ...
export const createNote = (content) => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = (id) => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
// ...
```

### Combined Reducers

As the store of an app becomes more complex, having multiple different state attributes, we want to use many reducers. Combine reducers when creating the store in the main.jsx file:

```javascript
// ...
import anecdoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
// ...
```

### Selector and Dispatch

Install the hooks API of the react-redux library to simplify accessing and modifying state:

```bash
npm install react-redux
```

Ensure our main.jsx file is providing the store to our app:

```javascript
import { Provider } from 'react-redux'
// ...

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

Get state attributes as follows:

```javascript
const anecdotes = useSelector(state => state.anecdotes)
```

Dispatch action creators as follows:

```javascript
const dispatch = useDispatch()

const vote = (id) => {
    dispatch(increaseVotes(id))
}
```

## Redux Toolkit

Redux toolkit removes repetitive boilerplate from the standard redux library. 

### Store

With Redux Toolkit main.jsx looks like this:

```javascript
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App'
import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

console.log(store.getState())

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### Reducers

With Redux Toolkit reducers look like this:

```javascript
import { createSlice } from '@reduxjs/toolkit'

// ...

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId(),
      })
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }
      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    }
  },
})
```

### Logging State

Redux Toolkit uses the Immer library to support mutable state, but this causes he output of the state to display in an unreadbale format. Use the current() function to make the output human readbale.

```javascript
import { createSlice, current } from '@reduxjs/toolkit'
// ...
console.log(current(state))
```

### Redux Thunk

Use Redux Thunk to define asynchronous reducer behavior. 

```javascript
// ...
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    // ...
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

// This is an example of a Redux Thunk function
export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export default noteSlice.reducer
```

## Test Driven Development

Install Jest

```bash
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest
```

Configure the .babelrc:

```babel
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Expand package.json:

```json
{
  // ...
  "scripts": {
    // ...
    "test": "jest"
  },
  // ...
}
```

Alter eslintrc.cjs:

```cjs
module.exports = {
  // ...
  env: { 
    // ...
    "jest/globals": true
  },
  // ...
}
```

Install deep-freeze to ensure that the reducer is an immutable function.

```bash
npm install --save-dev deep-freeze
```

Reducer tests can be stored as src/reducers/counterReducer.test.js 

```javascript
import noteReducer from './noteReducer'
import deepFreeze from 'deep-freeze'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })
})
```

## Uncontrolled Forms

Detaching the the state value from form inputs results in an uncontrolled form. Uncontrolled inputs have limitations (for example, dyanmic error messages and disabling the submit button based on certain input).

```javascript
<form onSubmit={addNote}>
    <input name="note" /> 
    <button type="submit">add</button>
</form>
```

The value of this field can be accessed as follows:

```javascript
addNote = (event) => {
  // ...
  const content = event.target.note.value
  event.target.note.value = ''
}
```