const got = require('got')
const parser = require('xml2json')

const FEEDS = [
  'https://www.alfredapp.com/blog/feed.xml',
  'https://jestjs.io/blog/feed',
  'https://reactjs.org/feed.xml',
  'https://explosm-1311.appspot.com/',
  'https://bucklescript.github.io/blog/feed.xml',
  'https://devblogs.microsoft.com/typescript/feed/',
  'https://babeljs.io/blog/feed.xml',
]

const getFeeds = async () => {
  const feeds = await Promise.all(FEEDS.map(url => got(url)))

  return feeds.flatMap((res, i) => {
    const data = JSON.parse(parser.toJson(res.body))
    const { description, title, link, language = '' } = data.rss.channel
    const desc = typeof description === 'object' ? '' : description

    return `INSERT INTO feed (description, title, link, language, website)
        VALUES ('${desc}', '${title}', '${FEEDS[i]}', '${language}', '${link}')`
  })
}

exports.up = async pgm => {
  // User
  pgm.createTable('user', {
    id: { type: 'id', primaryKey: true },
    email: { type: 'text', notNull: true },
  })

  // Feeds
  pgm.createTable('feed', {
    id: { type: 'id', primaryKey: true },
    link: { type: 'text', notNull: true, unique: true },
    title: { type: 'text', notNull: true },
    description: { type: 'text', notNull: true },
    website: { type: 'text' },
    language: { type: 'text' },
    updated_at: { type: 'timestamp', default: 'NOW()' },
  })

  // User-feed relation
  pgm.createTable('user_feed', {
    user_id: { type: 'integer', references: 'user', notNull: true },
    feed_id: { type: 'integer', references: 'feed', notNull: true },
  })

  pgm.createIndex('user_feed', ['user_id', 'feed_id'], { unique: true })

  // Feed items
  pgm.createType('feed_category', ['Comics', 'Uncategorized'])

  pgm.createTable('feed_item', {
    id: { type: 'id', primaryKey: true },
    category: {
      type: 'feed_category',
      notNull: false,
      default: 'Uncategorized',
    },
    description: { type: 'text', notNull: true },
    guid: { type: 'text', notNull: true, unique: true },
    link: { type: 'text', notNull: true },
    pub_date: { type: 'timestamp', notNull: true },
    title: { type: 'text', notNull: true },
    feed_id: { type: 'integer', notNull: true, references: 'feed' },
  })

  pgm.createIndex('feed_item', 'guid')

  // User-feed_item relation
  pgm.createTable('user_feed_item', {
    user_id: { type: 'integer', references: 'user' },
    feed_item_id: { type: 'integer', references: 'feed_item' },
    read: { type: 'boolean', default: false },
  })

  const feeds = await getFeeds()

  feeds.forEach(f => {
    pgm.sql(f)
  })

  pgm.sql(`INSERT INTO "user" (email) VALUES ('rickard.laurin@gmail.com')`)
}

exports.down = pgm => {
  pgm.dropTable('user_feed')
  pgm.dropTable('user_feed_item')
  pgm.dropTable('feed_item')
  pgm.dropType('feed_category')
  pgm.dropTable('user')
  pgm.dropTable('feed')
}
