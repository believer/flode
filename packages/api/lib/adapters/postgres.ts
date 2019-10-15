import { Client } from 'pg'
import config from '../config'
import { SQL } from '../types'

const wait = (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve(), ms))

async function connect(attemptNo = 0): Promise<any> {
  try {
    const client = new Client(config.postgres)
    await client.connect()

    return client
  } catch (err) {
    console.warn(err)

    if (attemptNo >= 10) {
      throw err
    }

    const delay = Math.min(1000 * attemptNo, 7000)
    await wait(delay)
    return connect(++attemptNo)
  }
}

export async function client() {
  const client = await connect()
  return client
}

export async function query<T = any>(
  sql: SQL,
  params: any[] = []
): Promise<{ rows: T }> {
  // when using `sql-template-strings`
  if (typeof sql !== 'string') {
    params = sql.values
    sql = sql.text
  }

  const conn = await connect()

  try {
    const result = await conn.query(sql, params)
    return result
  } finally {
    await conn.end()
  }
}

export default {
  client,
  query,
}
