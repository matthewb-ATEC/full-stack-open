# Part 8

This part of the course is about GraphQL, Facebook's alternative to REST for communication between browser and server.

## GraphQL

GraphQL is a different way of communicating with the server that can reduce the number of queries compared to REST, expecially for complex queries.

### Apollo server

Apollo Server is a library for implementing a GraphQL server. Start a new project with:

```bash
npm init
npm install @apollo/server graphql
```

Create index.js with the following contents:

```javascript
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: 'Arto Hellas',
    phone: '040-123543',
    street: 'Tapiolankatu 5 A',
    city: 'Espoo',
    id: '3d594650-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Matti Luukkainen',
    phone: '040-432342',
    street: 'Malminkaari 10 A',
    city: 'Helsinki',
    id: '3d599470-3436-11e9-bc57-8b80ba54c431',
  },
  {
    name: 'Venla Ruuska',
    street: 'Nallemäentie 22 C',
    city: 'Helsinki',
    id: '3d599471-3436-11e9-bc57-8b80ba54c431',
  },
]

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String! 
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

Start the server by running:

```bash
node index.js
```

### Queries and resolvers

Every query defines the type of parameters it requires and the type of output it provides.
Each query must have an associate resolver that describes the functionality of the query.
For schemas of objects within objects, we must define a custom resolver because the nested object does not have an ID:

```javascript
type Address {
  street: String!
  city: String!
}

type Person {
  name: String!
  phone: String
  address: Address!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}
```

### Mutations

All operations which cause a change are described in the schema as the keys of type Mutation.

```javascript
const { v1: uuid } = require('uuid')
// ...
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
// ...
const resolvers = {
  // ...
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

### Error Handling

Validation covers some error handling, but for mutations may require explicit error handling. To prevent adding the same number to a phonebook multiple times we do the following:

```javascript
const { GraphQLError } = require('graphql')
// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
          },
        })
      }

      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    },
  },
}
```

### Enumerables

We can query for optional fields using the YesNO enum:

```javascript
query {
  allPersons(phone: YES) {
    name
    phone
  }
}

enum YesNo {
  YES
  NO
}

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}

const resolvers = {
  // ...
  Query: {
  personCount: () => persons.length,
  allPersons: (root, args) => {
    if (!args.phone) {
      return persons
    }
    const byPhone = (person) =>
      args.phone === 'YES' ? person.phone : !person.phone
    return persons.filter(byPhone)
  },
  findPerson: (root, args) =>
    persons.find(p => p.name === args.name)
},
}
```

### Updating Data

To change the phonenumber of a person we can do the following:

```javascript
type Mutation {
  // ...
  editNumber(
    name: String!
    phone: String!
  ): Person
}

const resolvers = {
  // ...
  Mutation: {
    // ...
    editNumber: (root, args) => {
      const person = persons.find((p) => p.name === args.name);
      if (!person) {
        return null;
      }

      const updatedPerson = { ...person, phone: args.phone };
      persons = persons.map((p) => (p.name === args.name ? updatedPerson : p));
      return updatedPerson;
    },
  },
};
```

### Combined Queries

Multiple queries can be grouped into one query, but if they share the same name they must be given an alternative name:

```javascript
query {
  havePhone: allPersons(phone: YES){
    name
  }
  phoneless: allPersons(phone: NO){
    name
  }
}
```

## Apollo Client

To send query requests to the apollo server we can use the apollo client library. Install it on the frontend with:

```bash
npm install @apollo/client graphql
```

Create the and provide the client in the main.jsx file:

```javascript
import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
```

### Making Queries

use the useQuery() hook to execute queries:

```javascript
import { gql, useQuery } from '@apollo/client'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return <div>{result.data.allPersons.map((p) => p.name).join(', ')}</div>
}

export default App
```

### Named Queries and Variables

We can pass parameters into named queries using the $variable syntax. We can also prevent the useQuery hook from executing when the component is rendered by adding coniditions to the skip option:

```javascript
import { useState } from 'react'
import { gql, useQuery } from '@apollo/client'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null)
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })

  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }
  // ...
}
```

### Mutations

The useMutation() hook can be used to send mutation queries.

```javascript
import { gql, useMutation } from '@apollo/client'

const CREATE_PERSON = gql`
  // ...
`

const PersonForm = () => {
  // ...
  const [createPerson] = useMutation(CREATE_PERSON)

  const submit = (event) => {
    event.preventDefault()
    createPerson({ variables: { name, phone, street, city } })
    // ...
  }

  return (
    // ...
  )
}
```

### Cache

Queries saved their results in the browser cache but that cache can become innacurate after mutations. To properly update the cache we can either continuously poll the server for updates or manually update the refetch queires after mutations. Both have pros and cons.

```javascript
const result = useQuery(ALL_PERSONS, {
  pollInterval: 2000,
})
```

```javascript
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [{ query: ALL_PERSONS }],
})
```

### Project Structure

Queries can be stored in their own queries.js file and imported where needed:

```javascript
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    // ...
  }
`
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    // ...
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
    // ...
  }
`
```

```javascript
import { ALL_PERSONS } from './queries'

const App = () => {
  const result = useQuery(ALL_PERSONS)
  // ...
}
```

### Error Handling

Mutations will return errors that can be handled using the onError option:

```javascript
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [{ query: ALL_PERSONS }],
  onError: (error) => {
    const messages = error.graphQLErrors.map((e) => e.message).join('\n')
    setError(messages)
  },
})
```

For queries that return null when a mutable object is not found GraphQL does not consider null to be an error. We must manaully identify and set the error message in these instances:

```javascript
const [changeNumber, result] = useMutation(EDIT_NUMBER)

useEffect(() => {
  if (result.data && result.data.editNumber === null) {
    setError('person not found')
  }
}, [result.data])
```

## Mongoose and Apollo

Once the backend has apollo, install mongoose and dotenv to set up the database connection:

```bash
npm install mongoose dotenv
```

### Transforming JSON

GraphQL automatically converts from \_id to id when retrieving data from the a mongo database.

### Resolver Promises

Resolvers return promises rather than objects so we cand use async/await syntax.

### Error Handling

Validation is handled through the mongoose schema. Our resolvers must implement a try/catch block to handle these errors:

```javascript
const { GraphQLError } = require('graphql')

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })

      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Saving person failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return person
    },
    // ...
  },
}
```

### User Authentication

Users require a mongoose schema, GraphQL schema, and resolvers:

```javascript
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
    },
  ],
})

module.exports = mongoose.model('User', schema)
```

```javascript
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

```javascript
const jwt = require('jsonwebtoken')

Mutation: {
  // ..
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
},
```

JWT_SECRET must be defined in the .env file.

### Context

By adding context to the apollo server we can provide the user identification information to all resolvers:

```javascript
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate(
        'friends'
      )
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

Values from the context can be accessed as follows:

```javascript
Query: {
  // ...
  me: (root, args, { currentUser }) => {
    return currentUser
  }
},
```
