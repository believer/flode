import configPackage from '@iteam/config'

interface Postgres {
  host: string
  port: number
  user: string
  password: string
  database: string
  schema: string
}

export interface Config {
  postgres: Postgres
}

const config = configPackage({
  file: `${__dirname}/../config.json`,
  defaults: {
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
  postgres: config.get('postgres'),
} as Config
