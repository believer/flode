import { DbAdapter } from '@app/types'
import SQL from 'sql-template-strings'

export const getUser = async (db: DbAdapter, id: string) => {
  const { rows } = await db.query(
    SQL`SELECT id, email FROM "user" WHERE id = ${id}`
  )

  return rows[0]
}
