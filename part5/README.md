# Part 5

In this part we return to the frontend, first looking at different possibilities for testing the React code. We will also implement token based authentication which will enable users to log in to our application.

## Component Children

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

## End to End Testing

Use Playwright to simulate end to end interaction int he browser.

```bash
npm install playwright@latest
```

The installation asks a few questions which can be answered as follows:

```bash
Do you want ot use TypeScript or JavaScript? (pick based on project)
Where to put your end-to-end tests? tests
Add a GitHub Actions workflow? false
Install Playwright browsers (can be done manually via 'npx playwright install')? true
```

Your operating system may not support all browsers. You can either specificy targeted browsers in package.json with --project=:

```json
"test": "playwright test --project=chromium --project=firefox",
```

Or you can remove problematic browsers from playwright.config.js:

```javascript
projects: [
  // ...
  //{
  //  name: 'webkit',
  //  use: { ...devices['Desktop Safari'] },
  //},
  // ...
]
```

Update package.json to include a script for running tests and test reports as follows:

```json
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

Make an npm script for the backend, which will enable it to be started in testing mode.

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test node --test",
    "start:test": "NODE_ENV=test node index.js"
  },
  // ...
}
```

Playwright waits for elements for 5-30 seconds which can slow down test development. Change this in the playwright.config.js:

```javascript
module.exports = defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  // ...
})
```

When developing tests you can use playwright's UI mode as follows:

```bash
npm test -- --ui
```

### Working with the Database

Access to the database in end to end testing must be integrated by adding a new backend endpoint strictly for testing. The router for the controller may look like this:

```javascript
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```

Make sure to only add this router to the backend app when it's run in test-mode:

```javascript
// ...

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)


if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// ...

module.exports = app
```

When running these end to end tests make sure the backend is running in test mode:

```bash
  npm run start:test
```

### Running Tests One by One

```bash
npm test -- -g "test name here"
```

### Base URL

Since we have the proxy in the vite.config.js that forwards all requests made by the frontend to http://localhost:5173/api to the backend, we can update our playwright.config.js to use the frontend as our base url.

```javascript
module.exports = defineConfig({
  // ...
  use: {
    baseURL: 'http://localhost:5173',
  },
  // ...
}
```

Now the commands that use the base url can be simplified to this:

```javascript
await page.goto('/')
await page.post('/api/tests/reset')
```

### Debugging Tests

Run a test in debug mode as follows:

```bash
npm test -- -g'test name here' --debug
```

To execute a test up until a certain point and then start debug mode, add a page.pause() statement when you want to start debugging.

```javascript
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    // ...
  }

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      // ...
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })
  
      test('one of those can be made nonimportant', async ({ page }) => {

        await page.pause()
        const otherNoteText = await page.getByText('second note')
        const otherNoteElement = await otherNoteText.locator('..')
      
        await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})
```

Sometimes the tests interact with the server too quickly and some requests are lost in the process. Wait for the request to finish to prevent this:

```javascript
const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor()
}
```

You can log a visual trace of the tset with the following command:

```bash
npm run test -- --trace on
```