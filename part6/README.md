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

The impat of the action type is defined using a reducer. Reducers take in the current state and an action and return the new state. Reducers must be pure functions, meaning they return the same value when provided the same parameters.

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

## Uncontrolled Form

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

## Action Creators

Functions that create actions are canlled action creators. These functions can be isolated from react components into their related reducer's file.

```javascript
const noteReducer = (state = [], action) => {
  // ...
}

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

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

export default noteReducer
```

So now the react component looks like this:

```javascript
const App = () => {
  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content))
    
  }
  
  const toggleImportance = (id) => {
    store.dispatch(toggleImportanceOf(id))
  }

  // ...
}
```

## Forwarding Redux Store to Components

Install the hooks API of the react-redux library.

```bash
npm install react-redux
```

Now our main.jsx file can provide the store to all child components using the Provider:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'

import { Provider } from 'react-redux'

import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <App />
  </Provider>
)
```

Components can access the store using the useSelector and useDispatch hooks.

```javascript
import { createNote, toggleImportanceOf } from './reducers/noteReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''

    dispatch(createNote(content))
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
    // ...
  )
}

export default App
```

