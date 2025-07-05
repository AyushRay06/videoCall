import User from "../modals/User"
import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
  try {
    const token = res.cookie.jwt

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized-token not provided" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized-Invalid Token." })
    }
    // here we can access userId as we passed userId as paylod in the token
    //   jwt.sign({ userId: newUser._id }

    const user = await User.findById(decode.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not fond" })
    }

    req.user = user
    next()
  } catch (error) {
    console.log("Error in protectRoute middleware", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
