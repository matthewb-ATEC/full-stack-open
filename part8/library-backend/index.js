const { ApolloServer } = require('@apollo/server')
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
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      /*
      const filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id // Use author's _id to match the books
        } else {
          return [] // Return empty if no matching author is found
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] } // Match if the genre is in the book's genres array
      }
      */
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}),
  },
  /*Author: {
    bookCount: async (root) => {
      return Book.find({}).filter((book) => book.author === root.name).length
    },
  },*/

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })

      if (!author) {
        let author = new Author({
          name: args.author,
          born: null,
        })
        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author.id,
        genres: args.genres,
      })

      await book.save()

      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo
      return author.save()
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
