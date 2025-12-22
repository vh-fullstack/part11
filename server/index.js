const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const path = require('path')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const User = require('./models/user')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config()

// setup is now within a function
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connection to MongoDB:', error.message)
    process.exit(1)
  }

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ],
  })

  await server.start()

  app.use(cors())
  app.use(express.json())

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (err) {
            return {}
          }
        }
      },
    }),
  )

  /*   app.get('/health', (req, res) => {
    res.send('ok')
  }) */

  app.get('/health', (req, res) => {
    // mongoose.connection.readyState:
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState === 1) {
      res.status(200).send('ok')
    } else {
      res.status(500).send('database disconnected')
    }
  })

  // ... static file serving comes AFTER this ...
  app.use(express.static(path.join(__dirname, '../client/dist')))

  const PORT = process.env.PORT || 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()