const typeDefs = `
    type User {
      username: String!
      favoriteGenre: String!
      id: ID!
    }

    type Token {
      value: String!
    }

    type Book {
        title: String!,
        published: Int!,
        author: Author!,
        id: String!,
        genres: [String!]!,
    }

    type Author {
        name: String!,
        id: String!,
        born: Int,
        bookCount: Int
    }

    type Query {
        me: User
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        createUser(
          username: String!
          favoriteGenre: String!
        ): User
        login(
          username: String!
          password: String!
        ): Token,
        addBook(
            title: String!,
            published: Int!,
            author: String!,
            genres: [String!]!,
        ): Book!,
        editAuthor(name: String!, setBornTo: Int!): Author
    }

    type Subscription {
        bookAdded: Book!
    }
`

module.exports = typeDefs
