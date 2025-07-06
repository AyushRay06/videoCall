import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.route.js"
import { connectDB } from "./lib/db.js"
// import userRoutes from "./routes/user.routes.js"
// import chatRoutes from "./routes/chat.routes.js"

dotenv.config()

const PORT = process.env.PORT || 5001
const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
// app.use("/api/chat", chatRoutes)

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
  connectDB()
})
