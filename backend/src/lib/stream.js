import { streamChat } from "stream-chat"
import dotenv from "dotenv"

dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRECT

if (!apiKey || apiSecret) {
  console.error("Stream API key or secrect is missing.")
  return
}

const streamClient = streamChat.getInstance(apiKey, apiSecret)

export const upstreamUser = async () => {
  try {
    await streamClient.upsertUsers([userData])
    return userData
  } catch (error) {
    console.log("Error while creating user for  stream", error)
  }
}

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is s string
    const userIdStr = userId.toString()
    return streamClient.createToken(userIdStr)
  } catch (error) {
    console.error("Error generating Stream token:", error)
  }
}
