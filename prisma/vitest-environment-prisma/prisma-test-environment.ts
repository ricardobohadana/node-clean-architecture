// import { prisma } from '@/data/prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'crypto'
import 'dotenv/config'
import { Environment } from 'vitest'

function generateDatabaseUrl(file: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Por favor, indique uma DATABASE_URL nas variáveis de ambiente.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.pathname = file + '.db'

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const file = randomUUID()
    const databaseURL = generateDatabaseUrl(file)
    process.env.DATABASE_URL = databaseURL
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${file}" CASCADE`)
        // await prisma.$disconnect()
        execSync(`rm ./${file}.db`)
      },
    }
  },
}
