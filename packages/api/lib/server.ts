import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import feed from './resolvers/feed'
import merge from 'lodash.merge'
import dbAdapter from './adapters/postgres'

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

const server = new ApolloServer({
  typeDefs: [typeDefs, feed.typeDefs],
  resolvers: merge(feed.resolvers),
  context: () => ({
    db: dbAdapter,
  }),
})

const app = express()

server.applyMiddleware({ app })

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
