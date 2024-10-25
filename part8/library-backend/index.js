const { ApolloServer } = require('@apollo/server')
const { GraphQLError } = require('graphql')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

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
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
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
    addBook: async (root, args) => {
      try {
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
    editAuthor: async (root, args) => {
      try {
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
