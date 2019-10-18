import dbAdapter from '@app/adapters/postgres'
import authentication from '@app/resolvers/authentication'
import feed from '@app/resolvers/feed'
import user from '@app/resolvers/user'
import {
  ApolloServer,
  gql,
  IResolvers,
  makeExecutableSchema,
} from 'apollo-server-express'
import express from 'express'
import { AuthDirective } from 'graphql-directive-auth'
import merge from 'lodash.merge'
import config from '@app/config'

const typeDefs = gql`
  directive @isAuthenticated on FIELD | FIELD_DEFINITION
  directive @hasRole(role: String) on FIELD | FIELD_DEFINITION

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`

process.env.APP_SECRET = config.auth.secret

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, feed.typeDefs, user.typeDefs, authentication.typeDefs],
  resolvers: merge(
    feed.resolvers,
    user.resolvers,
    authentication.resolvers
  ) as IResolvers,
  schemaDirectives: {
    ...AuthDirective(),
  },
})

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({
    db: dbAdapter,
    req,
  }),
})

const app = express()

server.applyMiddleware({ app })

app.listen({ port: 4000 }, async () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
})
