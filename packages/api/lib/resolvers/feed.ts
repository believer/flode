import { Resolvers } from '@app/__generated__/rss'
import { gql, ApolloError } from 'apollo-server-express'
import { updateFeeds, feeds, feedInformation } from '@app/services/feed'
import SQL from 'sql-template-strings'

export const typeDefs = gql`
  enum FeedItemCategory {
    Comics
    TypeScript
    Uncategorized
  }

  type FeedItem {
    category: FeedItemCategory!
    description: String!
    shortDescription: String!
    guid: String!
    id: ID!
    isRead: Boolean!
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
    article(id: ID!): FeedItem
    feeds: [Feed!]! @isAuthenticated
  }

  extend type Mutation {
    addFeed(input: AddFeedInput!): Feed

    markAsRead(input: MarkAsReadInput!): Boolean! @isAuthenticated
    markAsUnread(input: MarkAsReadInput!): Boolean! @isAuthenticated
    markAllAsRead: Boolean! @isAuthenticated

    """
    Update a users subscribed feeds
    """
    updateFeeds: [FeedItem!]! @isAuthenticated
  }
`

export const resolvers: Resolvers = {
  Query: {
    article: async (_, { id }, { db }) => {
      const query = SQL`
    SELECT 
        fi.*, 
      TO_CHAR(
        pub_date, 'YYYY-MM-DD"T"HH24:MI:SS".000Z"'
      ) AS "pubDate", 
      CASE WHEN ufi.read IS NULL THEN FALSE ELSE TRUE END as "isRead",
      SUBSTRING(REGEXP_REPLACE(description, E'<[^>]+>', '', 'gi'), 0, 97) || '...' as "shortDescription"
    FROM 
      feed_item fi 
      LEFT JOIN user_feed_item ufi ON ufi.feed_item_id = fi.id 
    WHERE fi.id = ${id}
  `

      const {
        rows: [first = null],
      } = await db.query(query)

      return first
    },

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
        ON CONFLICT DO NOTHING
      `

      await db.query(query)

      return true
    },

    markAllAsRead: async (_, _args, { auth, db }) => {
      const allQuery = SQL`
        SELECT 
          fi.id
        FROM 
          user_feed uf 
          INNER JOIN feed_item fi ON fi.feed_id = uf.feed_id
        WHERE 
          uf.user_id = ${auth.sub}
      `

      const { rows } = await db.query(allQuery)

      for (let row of rows) {
        const query = SQL`
          INSERT INTO user_feed_item (user_id, feed_item_id, read)
          VALUES (${auth.sub}, ${row.id}, TRUE)
          ON CONFLICT DO NOTHING
        `

        await db.query(query)
      }

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
