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
