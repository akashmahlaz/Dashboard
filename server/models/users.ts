import { prisma } from "../lib/prisma.js"
import bcrypt from "bcryptjs"

interface CreateUserInput {
  name: string
  email: string
  password: string
}

export const createUser = async ({ name, email, password }: CreateUserInput) => {
  const hashedPassword = await bcrypt.hash(password, 12)

  return prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true },
  })
}