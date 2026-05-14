import "dotenv/config"
import express from "express"
import cors from "cors"
import { ExpressAuth } from "@auth/express"
import authRoutes from "./routes/auth.js"

const app = express()
const PORT = Number(process.env.PORT) || 5000

// Required by Auth.js to detect HTTPS behind a proxy
app.set("trust proxy", true)

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json())

// Auth.js — handles /auth/callback, /auth/session, /auth/csrf, etc.
app.use("/auth/*", ExpressAuth({ providers: [] }))

// Custom auth routes (signup, etc.)
app.use("/auth", authRoutes)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[server] Running at http://localhost:${PORT}`)
})