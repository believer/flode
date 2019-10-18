import { updateFeeds, userFeed } from '@app/services/feed'
import { Resolvers, User, FeedFilter } from '@app/__generated__/rss'
import { gql } from 'apollo-server-express'
import SQL from 'sql-template-strings'
import { getUser } from '@app/services/user'

interface UserFeed extends User {
  filterFeed?: FeedFilter
}

export const typeDefs = gql`
  enum FeedFilter {
    unread
    read
  }

  type User {
    id: ID!
    email: String!
    feed: [FeedItem!]!
  }

  input SubcribeToFeedInput {
    feedId: ID!
  }

  type Stuff {
    hello: String!
  }

  extend type Query {
    getStuff: Stuff!
    user(filterFeed: FeedFilter): User @isAuthenticated
  }

  extend type Mutation {
    subscribeToFeed(input: SubcribeToFeedInput!): User! @isAuthenticated
    unsubscribeToFeed(input: SubcribeToFeedInput!): User! @isAuthenticated
  }
`

export const resolvers: Resolvers = {
  User: {
    feed: (parent: UserFeed, _args, { db }) =>
      userFeed(db, parent.id, parent.filterFeed),
  },

  Query: {
    getStuff: () => ({
      hello: 'World!',
    }),

    user: async (_, { filterFeed }, { auth, db }) => {
      const user = await getUser(db, auth.sub)

      return {
        ...user,
        filterFeed,
      }
    },
  },

  Mutation: {
    subscribeToFeed: async (_, { input }, { auth, db }) => {
      const insertQuery = SQL`
        INSERT INTO user_feed (user_id, feed_id)
        VALUES (${auth.sub}, ${input.feedId})
      `

      await db.query(insertQuery)
      await updateFeeds(db, auth.sub)

      return getUser(db, auth.sub)
    },

    unsubscribeToFeed: async (_, { input }, { auth, db }) => {
      const deleteQuery = SQL`
        DELETE FROM user_feed
        WHERE user_id = ${auth.sub} AND feed_id = ${input.feedId}
      `

      await db.query(deleteQuery)

      return getUser(db, auth.sub)
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
