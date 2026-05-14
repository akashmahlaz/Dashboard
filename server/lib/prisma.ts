// Prisma 7 requires a driver adapter for direct connections.
// Run `pnpm prisma generate` after schema changes to regenerate the client.
import { PrismaClient } from "../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

const globalWithPrisma = global as typeof globalThis & {
  _prisma?: PrismaClient
}

export const prisma: PrismaClient =
  globalWithPrisma._prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalWithPrisma._prisma = prisma
}
