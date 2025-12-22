import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'


const authLink = new setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

// WebSockets need a full URL (ws:// or wss://). They can't use relative paths.
const wsUrl = import.meta.env.PROD
  ? `wss://${window.location.host}/graphql`
  : 'ws://localhost:4000/graphql'

const wsLink = new GraphQLWsLink(
  createClient({
    url: wsUrl,
  })
)

// If in Prod, use relative path (browser handles domain).
// If in Dev, use localhost:4000.
const httpLink = new HttpLink({
  uri: import.meta.env.PROD
    ? '/graphql'
    : 'http://localhost:4000/graphql',
})


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)