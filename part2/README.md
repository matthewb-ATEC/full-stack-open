# Part 2

Let's continue our introduction to React. First, we will take a look at how to render a data collection, like a list of names, to the screen. After this, we will inspect how a user can submit data to a React application using HTML forms. Next, our focus shifts towards looking at how JavaScript code in the browser can fetch and handle data stored in a remote backend server. Lastly, we will take a quick look at a few simple ways of adding CSS styles to our React applications.

## How to run a json server for testing

Make sure to install json server

```bash
npm install json-server --save-dev
```

Update the package.json file's scripts section to include:

```json
...
"scripts": {
    ...
    "server": "json-server -p3001 --watch db.json"
  },
...
```

Create a mock-database to store the jason server data in the root directory

```bash
touch db.json
```

Run the json server with the npm script

```bash
npm run server
```

## How to make http requests with axios

Make sure to install axios

```bash
npm install axios
```

Create a /services directory in the /src directory  
Create a new .jsx file to contain your service

```jsx
// import axios
import axios from "axios";

// declare the base url
const baseURL = "http://localhost:3001/persons";

// declare service functions using GET, POST, PUT, DELETE and PATCH
const getAll = () => {
  const request = axios.get(baseURL);
  // Parse the requests to return the data
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseURL, newPerson);
  return request.then((response) => response.data);
};

const updateID = (id, updatedPerson) => {
  const request = axios.put(`${baseURL}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

const deleteID = (id) => {
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

// Export the service functions to be used in other components
export default { getAll, create, updateID, deleteID };
```

Import the service in other components and execute the service functions using dot notation

```jsx
// Import the service
import personsService from "./services/persons";

// Use the service
personsService
  // Call a service function with the appropriate parameters
  .create(newPerson)
  // Handle the response
  .then((returnedPerson) => {
    setPersons(persons.concat(returnedPerson));
  })
  // Catch any errors
  .catch((error) => {
    console.log(error);
  });
```
