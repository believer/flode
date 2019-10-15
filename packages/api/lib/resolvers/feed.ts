import { gql } from 'apollo-server-express'
import got from 'got'
import md5 from 'md5'
import SQL from 'sql-template-strings'
import parser from 'xml2json'
import { FeedBody, ParsedRSS, DbAdapter } from '../types'
import { Resolvers, FeedItem } from '../__generated__/rss'

export const typeDefs = gql`
  enum FeedItemCategory {
    Comics
    Uncategorized
  }

  type FeedItem {
    category: FeedItemCategory!
    description: String!
    guid: String!
    link: String!
    pubDate: String!
    title: String!
  }

  input UpdateFeedsInput {
    feeds: [String!]!
  }

  extend type Query {
    feed: [FeedItem!]!
  }

  extend type Mutation {
    updateFeeds(input: UpdateFeedsInput!): [FeedItem!]!
  }
`

const feedItems = async (db: DbAdapter) => {
  const query = SQL`
    SELECT
      *,
      to_char(pub_date, 'YYYY-MM-DD"T"HH24:MI:SS".000Z"') as "pubDate"
    FROM feed ORDER BY pub_date DESC
  `

  const { rows } = await db.query<FeedItem[]>(query)

  return rows
}

export const resolvers: Resolvers = {
  Query: {
    feed: (_, _args, { db }) => feedItems(db),
  },

  Mutation: {
    updateFeeds: async (_, { input }, { db }) => {
      const result: FeedBody[] = await Promise.all(input.feeds.map(u => got(u)))

      const output = result.flatMap(res => {
        const data: ParsedRSS = JSON.parse(parser.toJson(res.body))

        return data.rss.channel.item.map(item => ({
          ...item,
          title: item.title || '',
          guid: md5(typeof item.guid === 'object' ? item.guid.$t : item.guid),
        }))
      })

      for (let {
        category,
        description,
        guid,
        link,
        pubDate,
        title,
      } of output) {
        if (category) {
          const query = SQL`
          INSERT INTO feed (category, description, guid, link, pub_date, title)
          VALUES (${category}, ${description}, ${guid}, ${link}, ${pubDate}, ${title})
          ON CONFLICT ON CONSTRAINT feed_guid_key DO NOTHING
        `

          await db.query(query)
        } else {
          const query = SQL`
          INSERT INTO feed (description, guid, link, pub_date, title)
          VALUES (${description}, ${guid}, ${link}, ${pubDate}, ${title})
          ON CONFLICT ON CONSTRAINT feed_guid_key DO NOTHING
        `

          await db.query(query)
        }
      }

      return feedItems(db)
    },
  },
}

export default {
  typeDefs,
  resolvers,
}
