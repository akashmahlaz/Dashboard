import type { Request, Response } from "express"
import { z } from "zod"
import { createUser } from "../models/users.js"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      issues: parsed.error.flatten().fieldErrors,
    })
    return
  }

  try {
    const user = await createUser(parsed.data)
    res.status(201).json(user)
  } catch (error) {
    // P2002 = Prisma unique constraint violation — email already registered
    if (error instanceof Error && error.message.includes("P2002")) {
      res.status(409).json({ error: "Email already in use" })
      return
    }
    console.error("[signup] Unexpected error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}