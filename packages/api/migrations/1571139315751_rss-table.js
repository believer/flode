exports.up = pgm => {
  pgm.createType('feed_category', ['Comics', 'Uncategorized'])

  pgm.createTable('feed', {
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
  })

  pgm.createIndex('feed', 'guid')
}

exports.down = pgm => {
  pgm.dropTable('feed')
  pgm.dropType('feed_category')
}
