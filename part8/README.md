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
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

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
`;

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
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
const { GraphQLError } = require("graphql");
// ...

const resolvers = {
  // ..
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new GraphQLError("Name must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      const person = { ...args, id: uuid() };
      persons = persons.concat(person);
      return person;
    },
  },
};
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
