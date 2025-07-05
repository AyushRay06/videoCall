import { upstreamUser } from "../lib/stream"
import User from "../modals/User"
import jwt from "jsonwebtoken"

// -------------------------signup----------------------------------
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || password) {
      return res.status(401).json({ msh: "All fields are required" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast characters" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." })
    }

    const existingUser = await User.findOne({
      email,
    })

    if (existingUser) {
      return res.status(400).json({ message: "User Already exist." })
    }

    const idx = Math.floor(Math.random() * 100) + 1 // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    })

    // Create user in stream as well

    try {
      await upstreamUser({
        id: newUser._id,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic || "",
      })
    } catch (error) {
      console.log("Error while upsearting user into stream", error)
    }

    // user created now assigning it a token(ist creat5e token then send it in the cookies)
    // tokebn creation
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // sending token
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({ success: true, user: newUser })
  } catch (error) {
    console.log("Error in signup controller", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// --------------------login-------------------------------

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "Inalid creentials" })
    }

    const isPasswordCorrect = await User.matchPassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    })

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.log("Error in login controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// --------------------logout-------------------------------
export const logout = () => {
  try {
    res.clearCookie("jwt")

    res.status(200).json({ success: true, message: "Logout successful" })
  } catch (error) {}
}

// -----------------------onboarding----------------------

export const onboarding = async (req, res) => {
  try {
    const {
      fullName,
      bio,
      profilePic,
      nativeLanguage,
      learningLanguage,
      location,
    } = req.body

    if (!nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "Missing required fields." })
    }
  } catch (error) {}
}
