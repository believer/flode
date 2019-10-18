import { SQLStatement } from 'sql-template-strings'
import postgres from './adapters/postgres'
import { Request } from 'express'

export interface FeedItem {
  category?: string
  description: string
  guid: string | { isPermaLink: boolean; $t: string }
  link: string
  pubDate: Date
  title: string
}

export interface Channel {
  item: FeedItem[]
}

export interface RSS {
  channel: Channel
}

export interface ParsedRSS {
  rss: RSS
}

export interface FeedBody {
  body: string
}

export type SQL = string | SQLStatement

export interface DbAdapter {
  client: typeof postgres.client
  query: typeof postgres.query
}

export interface AuthUser {
  sub: string
  email: string
}

export interface RSSContext {
  auth: AuthUser
  db: DbAdapter
}
