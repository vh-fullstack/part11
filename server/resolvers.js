const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const mongoose = require('mongoose')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {

      // No filters, return all books
      if (!args.author && !args.genre) {
        const booksFromDb = await Book.find({}).populate('author')
        return booksFromDb
      }

      const query = {}

      // filter by author
      if (args.author) {
        const author = await Author.findOne({ name: args.author })

        if (!author) {
          throw new GraphQLError('couldn\'t find author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
            }
          })
        }
        // if found, use the ID for the query
        query.author = author._id
      }

      // filter by genre
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }

      // execute the final query and return the result
      return Book.find(query).populate('author')
    },

    allAuthors: async () => {
      const authorsFromDB = await Author.find({})
      return authorsFromDB
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    allGenres: async () => {
      const genres = await Book.distinct('genres')
      return genres
    }
  },
  Author: {
    bookCount: async (root) => {
      const count = await Book.countDocuments({ author: root._id })
      return count
    },
    id: (root) => root._id
  },
  Mutation: {
    // addBook had a bug stemming from the fact that bookToReturn was a "live" Mongoose document
    // which retains an internal reference to the session it was created and managed with
    // which led to a persistent bug declaring that expired sessions were not permitted.
    addBook: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      // =================================================================
      // 1. VALIDATION BLOCK - Perform checks before starting the transaction
      // =================================================================
      if (!args.title || !args.author) {
        throw new GraphQLError('Title and Author are required fields.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: { title: args.title, author: args.author }
          }
        })
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Book title must be at least 5 characters long.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title
          }
        })
      }

      // =================================================================
      // 2. TRANSACTION BLOCK - Only proceed if validation passes
      // =================================================================
      // We use database transactions to ensure atomicity
      // We want to prevent scenarios where creating a new author succeeds but saving a new book fails
      const session = await mongoose.startSession()
      let bookToReturn

      try {
        session.startTransaction()

        // Find an existing author by name within the transaction session.
        let author = await Author.findOne({ name: args.author }).session(session)

        if (!author) {
          // If the author does not exist, create a new one within the session
          // Note: Mongoose validation on the Author schema will run here.
          // If the author name is invalid (e.g., too short), .save() will throw.
          const newAuthor = new Author({ name: args.author })
          author = await newAuthor.save({ session })
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        // Mongoose validation on the Book schema will run here.
        // If any field is invalid, .save() will throw, triggering the catch block.
        const savedBook = await book.save({ session })

        // Populate the author field for the return value
        const populatedBook = await savedBook.populate('author')

        // Convert the Mongoose Document to a plain object
        // This severs its connection to the session.
        bookToReturn = populatedBook.toObject()

        // If all operations were successful, commit the transaction.
        await session.commitTransaction()

      } catch (error) {
        // If any error occurred, abort the transaction.
        // This will undo the new author creation if the book save failed.
        await session.abortTransaction()

        throw new GraphQLError(`Failed to add book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT', // Mongoose validation errors are user input errors
            error
          }
        })
      } finally {
        session.endSession()
      }

      pubsub.publish('BOOK ADDED', { bookAdded: bookToReturn })

      return bookToReturn
    },
    editAuthor: async (root, args, context) => {

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        throw new GraphQLError('author not found, cannot update', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('saving author failed', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

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

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers