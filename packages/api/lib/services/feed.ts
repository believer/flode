import { DbAdapter, FeedBody, ParsedRSS } from '@app/types'
import { FeedItem, FeedFilter } from '@app/__generated__/rss'
import got from 'got'
import md5 from 'md5'
import SQL from 'sql-template-strings'
import parser from 'xml2json'

export const feeds = async (db: DbAdapter, id: string) => {
  const query = SQL`
    SELECT 
      f.*,
      CASE WHEN uf.feed_id IS NOT NULL THEN true ELSE false END as "isSubscribed"
    FROM 
      feed f 
      LEFT JOIN user_feed uf ON uf.feed_id = f.id AND uf.user_id = ${id}
  `
  const { rows } = await db.query(query)

  return rows
}

export const updateFeeds = async (db: DbAdapter, id: string) => {
  const { rows: feeds } = await db.query<{ id: string; url: string }[]>(SQL`
    SELECT 
      f.url,
      f.id
    FROM 
      user_feed uf 
      INNER JOIN feed f ON f.id = uf.feed_id 
    WHERE 
      uf.user_id = ${id}
  `)

  const result: FeedBody[] = await Promise.all(feeds.map(u => got(u.url)))

  const output = result.flatMap((res, i) => {
    const data: ParsedRSS = JSON.parse(parser.toJson(res.body))

    return data.rss.channel.item.map(item => ({
      ...item,
      feed_id: feeds[i].id,
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
    feed_id,
  } of output) {
    if (category) {
      const query = SQL`
      INSERT INTO feed_item (category, description, guid, link, pub_date, title, feed_id)
      VALUES (${category}, ${description}, ${guid}, ${link}, ${pubDate}, ${title}, ${feed_id})
      ON CONFLICT ON CONSTRAINT feed_item_guid_key DO NOTHING
      `

      await db.query(query)
    } else {
      const query = SQL`
      INSERT INTO feed_item (description, guid, link, pub_date, title, feed_id)
      VALUES (${description}, ${guid}, ${link}, ${pubDate}, ${title}, ${feed_id})
      ON CONFLICT ON CONSTRAINT feed_item_guid_key DO NOTHING
      `

      await db.query(query)
    }
  }

  return userFeed(db, id)
}

export const userFeed = async (
  db: DbAdapter,
  id: string,
  filter?: FeedFilter
) => {
  const query = SQL`
    SELECT 
        fi.*, 
      TO_CHAR(
        pub_date, 'YYYY-MM-DD"T"HH24:MI:SS".000Z"'
      ) AS "pubDate", 
      CASE WHEN ufi.read IS NULL THEN FALSE ELSE TRUE END 
    FROM 
      user_feed uf 
      INNER JOIN feed_item fi ON fi.feed_id = uf.feed_id 
      LEFT JOIN user_feed_item ufi ON ufi.feed_item_id = fi.id 
    WHERE uf.user_id = ${id}
  `

  if (filter && filter === 'unread') {
    query.append(`AND ufi.read IS FALSE OR ufi.read IS NULL `)
  }

  if (filter && filter === 'read') {
    query.append(`AND ufi.read IS TRUE `)
  }

  query.append(`ORDER BY pub_date DESC`)

  const { rows } = await db.query<FeedItem[]>(query)

  return rows
}
