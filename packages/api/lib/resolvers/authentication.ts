import config from '@app/config'
import { hashPassword } from '@app/utils/hash'
import { Resolvers } from '@app/__generated__/rss'
import { gql, AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import SQL from 'sql-template-strings'

export const typeDefs = gql`
  input CreateTokenInput {
    email: String!
    password: String!
  }

  extend type Mutation {
    createToken(input: CreateTokenInput!): String!
  }
`

export const resolvers: Resolvers = {
  Mutation: {
    createToken: async (_, { input }, { db }) => {
      try {
        const {
          rows: [user],
        } = await db.query(
          SQL`SELECT id, salt, password_hash FROM "user" WHERE email = ${input.email}`
        )

        const currentPassword = await hashPassword(input.password, user.salt)

        if (user.password_hash !== currentPassword) {
          throw new AuthenticationError('Invalid username or password')
        }

        return jwt.sign(
          { sub: user.id, email: input.email },
          config.auth.secret
        )
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
