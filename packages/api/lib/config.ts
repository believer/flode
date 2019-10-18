import configPackage from '@iteam/config'

interface Auth {
  secret: string
}

interface Postgres {
  host: string
  port: number
  user: string
  password: string
  database: string
  schema: string
}

export interface Config {
  auth: Auth
  postgres: Postgres
}

const config = configPackage({
  file: `${__dirname}/../config.json`,
  defaults: {
    auth: {
      secret: 'eraN8qBPs4Tt07m5DAkfUR0lmv0Hxv184wfrfY2zrVA44wi9cZ',
    },
    postgres: {
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'example',
      database: 'rss',
    },
  },
})

export default {
  auth: config.get('auth'),
  postgres: config.get('postgres'),
} as Config
