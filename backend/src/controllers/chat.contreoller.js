import { generateStreamToken } from "../lib/stream"

export const generateStreamTokenCon = async (req, res) => {
  try {
    const userId = req.user.id
    const token = generateStreamToken(userId)
    res.status(200).json(token)
  } catch (error) {
    console.log("Error in GenerateStreamTokenCon", error.message)
    res.status(500).json({ message: "Invalid Server Error" })
  }
}
