import { Resolvers } from '@app/__generated__/rss'
import { gql, ApolloError } from 'apollo-server-express'
import { updateFeeds, feeds, feedInformation } from '@app/services/feed'
import SQL from 'sql-template-strings'

export const typeDefs = gql`
  enum FeedItemCategory {
    Comics
    Uncategorized
  }

  type FeedItem {
    category: FeedItemCategory!
    description: String!
    guid: String!
    id: ID!
    link: String!
    pubDate: String!
    title: String!
  }

  type Feed {
    description: String
    id: ID!
    isSubscribed: Boolean!
    language: String
    link: String!
    title: String!
  }

  input AddFeedInput {
    url: String!
  }

  input ReadFeedItemInput {
    feedItemId: ID!
  }

  input MarkAsReadInput {
    feedItemId: ID!
  }

  extend type Query {
    feeds: [Feed!]! @isAuthenticated
  }

  extend type Mutation {
    addFeed(input: AddFeedInput!): Feed

    markAsRead(input: MarkAsReadInput!): Boolean! @isAuthenticated
    markAsUnread(input: MarkAsReadInput!): Boolean! @isAuthenticated

    """
    Update a users subscribed feeds
    """
    updateFeeds: [FeedItem!]! @isAuthenticated
  }
`

export const resolvers: Resolvers = {
  Query: {
    feeds: (_, _args, { auth, db }) => feeds(db, auth.sub),
  },

  Mutation: {
    addFeed: async (_, { input }, { db }) => {
      try {
        const { title, link, description, language } = await feedInformation(
          input.url
        )

        const query = SQL`
        INSERT INTO feed (description, title, link, language)
        VALUES (${description}, ${title}, ${link}, ${language})
        RETURNING *
      `

        const { rows } = await db.query(query)

        return rows[0]
      } catch (e) {
        if (e.detail.includes('already exists')) {
          throw new ApolloError('The feed already exists')
        }

        throw new Error(e)
      }
    },

    markAsRead: async (_, { input }, { auth, db }) => {
      const query = SQL`
        INSERT INTO user_feed_item (user_id, feed_item_id, read)
        VALUES (${auth.sub}, ${input.feedItemId}, TRUE)
      `

      await db.query(query)

      return true
    },

    markAsUnread: async (_, { input }, { auth, db }) => {
      const query = SQL`
        UPDATE user_feed_item 
        SET read = FALSE 
        WHERE 
          user_id = ${auth.sub}
          AND feed_item_id = ${input.feedItemId}
      `

      await db.query(query)

      return true
    },

    updateFeeds: async (_, _args, { auth, db }) => updateFeeds(db, auth.sub),
  },
}

export default {
  typeDefs,
  resolvers,
}
