# Part 5

In this part we return to the frontend, first looking at different possibilities for testing the React code. We will also implement token based authentication which will enable users to log in to our application.

## Children

Components can wrap other elements and components that are accessible through the prop 'children'.

```javascript
<Togglable>
  <p>This is a child of Togglable</p>
</Togglable>
```

```javascript
const Togglable = ({ children }) => {
  return <div>{children}</div>;
};
```

## Forward References

Use forward references to change the state of a component from an external source. Create a reference and pass it into the component you want to change as a prop.

```javascript
const ref = useRef()
<Togglable ref={ref}/>
```

This hook ensures the same reference (ref) that is kept throughout re-renders of the component.

In the Togglable component, wrap the component in a forwardRef call and expose the function you want to use externally to modify the internal state.

```javascript
const Togglable = forwardRef((props, refs) => {
  const toggleVisibility = () => {
    // Modify state
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return ();
})

Togglable.displayName = 'Togglable'
```

The state altering funciton can now be called from the component with the reference as follows:

```javascript
noteFormRef.current.toggleVisibility();
```

## Prop Types

Component props can be specified using the following package:

```bash
npm instal prop-types
```

Define the structure of a components props as follows:

```javascript
import PropTypes from "prop-types";

const LoginForm = ({ handleSubmit, username }) => {
  // ...
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};
```

## Testing the Frontend

There are many helpful libraries for testing the front end. Install the following:

```bash
npm install --save-dev vitest jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

Configure the package.json test script:

```json
{
  "scripts": {
    // ...
    "test": "vitest run"
  }
  // ...
}
```

Next create a file testSetup.js in the project root. After each test, cleanup() resets jsdom which simulates the browser. With globals: true, there is no need to import keywords such as describe, test and expect into the tests.

```javascript
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

Update the vite.config.js so that describe, test, and expect are accessible in the test files.

```javascript
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})
```

### Fix Test Related Lint Errors

Prevent linting errors related to testing keywords by installing the following package:

```bash
npm install --save-dev eslint-plugin-vitest-globals
```

Enable this plugin by editing the .eslintrc.cjs as follows:

```cjs
module.exports = {
  // ...
  env: {
    // ...
    "vitest-globals/env": true
  },
  extends: [
    // ...
    'plugin:vitest-globals/recommended',
  ],
  // ...
}
```

### Testing for Elements

Find an element with its corresponding id using the react-testing-library's getByTestId.

```javascript
<div data-testid="custom-element" />
```

```javascript
import { render, screen } from '@testing-library/react'

test('renders content', () => {
  render(<MyComponent />)

  const element = screen.getByTestId('custom-element')

  screen.debug()
})
```

### Testing Button Clicks

Use the following package to handle testing events like clicking buttons:

```bash
npm install --save-dev @testing-library/user-event
```

```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

// ...

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  
  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

### Testing Forms

Testing forms is similar to clicking buttons. Use the userEvent object to enter text into input fields.

```javascript
import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

### Test Coverage

Assess the range of test coverage by running the following command:

```bash
npm test -- --coverage
```