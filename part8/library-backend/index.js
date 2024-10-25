const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

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
`

const resolvers = {
  Query: {
    me: (root, args, { currentUser }) => {
      return currentUser
    },
    bookCount: async () => {
      try {
        return await Book.collection.countDocuments()
      } catch (error) {
        throw new GraphQLError('Failed to fetch book count', {
          extensions: { code: 'BOOK_COUNT_FAILED', error },
        })
      }
    },
    authorCount: async () => {
      try {
        return await Author.collection.countDocuments()
      } catch (error) {
        throw new GraphQLError('Failed to fetch author count', {
          extensions: { code: 'AUTHOR_COUNT_FAILED', error },
        })
      }
    },
    allBooks: async (root, args) => {
      try {
        const filter = {}

        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          if (author) {
            filter.author = author._id
          } else {
            return []
          }
        }

        if (args.genre) {
          filter.genres = { $in: [args.genre] }
        }

        return await Book.find(filter).populate('author')
      } catch (error) {
        throw new GraphQLError('Failed to fetch books', {
          extensions: { code: 'ALL_BOOKS_QUERY_FAILED', error },
        })
      }
    },
    allAuthors: async () => {
      try {
        return await Author.find({})
      } catch (error) {
        throw new GraphQLError('Failed to fetch authors', {
          extensions: { code: 'ALL_AUTHORS_QUERY_FAILED', error },
        })
      }
    },
  },
  Author: {
    bookCount: async (root) => {
      try {
        return await Book.countDocuments({ author: root._id })
      } catch (error) {
        throw new GraphQLError('Failed to fetch book count for author', {
          extensions: { code: 'AUTHOR_BOOK_COUNT_FAILED', error },
        })
      }
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre, // Include favoriteGenre here
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        }

        let author = await Author.findOne({ name: args.author })

        if (!author) {
          author = new Author({
            name: args.author,
            born: null,
          })
          await author.save()
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          author: author._id,
          genres: args.genres,
        })

        await book.save()

        return book.populate('author')
      } catch (error) {
        throw new GraphQLError('Failed to add book', {
          extensions: { code: 'ADD_BOOK_FAILED', error },
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      try {
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          })
        }

        const author = await Author.findOne({ name: args.name })

        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: { code: 'AUTHOR_NOT_FOUND' },
          })
        }

        author.born = args.setBornTo
        return await author.save()
      } catch (error) {
        throw new GraphQLError('Failed to edit author', {
          extensions: { code: 'EDIT_AUTHOR_FAILED', error },
        })
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
