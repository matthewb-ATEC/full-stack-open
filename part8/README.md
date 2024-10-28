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

```bash
npm install jsonwebtoken
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

### User Authentication on the Frontend

Now that users are stored in the mongo database in the backend and actions require atuhorization, we must store that authorization token on the front end:

```javascript
const App = () => {

  const [token, setToken] = useState(null)

  // ...

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    // ...
  )
}
```

Next, we define a mutation for logging in:

```javascript
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
```

The login form stores the token in state and localStorage:

```javascript
import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('APP_NAME-user-token', token)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    // ...
  )
}
```

We must reset the cache when the user logs out:

```javascript
const App = () => {
  // ...
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  // ...
  return (
    // ...
  )
}
```

Adding the token to the header of requests from the front end requires updating the client definition in main.jsx:

```javascript
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
})
```

Anywhere that a parameterized query accepts an optional parameter we must ensure that we send valid data or undefined:

```javascript
const submit = async (event) => {
    event.preventDefault()
    createPerson({
      variables: {
        name, street, city,
        phone: phone.length > 0 ? phone : undefined
      }
    })
```

Instead of updating the cache by refetching queries we can provide an update callback for a mutation:

```javascript
const [createPerson] = useMutation(CREATE_PERSON, {
  //...
  update: (cache, response) => {
    cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
      return {
        allPersons: allPersons.concat(response.data.addPerson),
      }
    })
  },
})
```

### Fragments

Define the structure of commonly returned data:

```javascript
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

Use the fragment in queries:

```javascript
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }
  ${PERSON_DETAILS}
`
```

### Subscriptions

Clients can subscribe to changes in the server. To utilize subscriptions we need to use expressMiddleware isntead of startStandaloneServer.

```bash
npm install express cors
```

```javascript
const { ApolloServer } = require('@apollo/server')

const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = 'mongodb+srv://databaseurlhere'

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

#### Subscriptions on the Server

Define a new subscription as follows:

```javascript
type Subscription {
  personAdded: Person!
}
```

To handle GraphQL subscriptions and Node.js WebSockets:

```bash
npm install graphql-ws ws @graphql-tools/schema
```

```javascript
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

// ...

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),

      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id).populate(
            'friends'
          )
          return { currentUser }
        }
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
```

Add a resolver for the personAdded subscription and send an update when adding a person:

```bash
npm install graphql-subscriptions
```

```javascript
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

// ...

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      pubsub.publish('PERSON_ADDED', { personAdded: person })

      return person
    },
  },

  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterator('PERSON_ADDED'),
    },
  },
}
```

### Subscriptions on the Client
