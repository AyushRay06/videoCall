import { upsertStreamUser } from "../lib/stream.js"
import User from "../modals/User.js"
import jwt from "jsonwebtoken"

// -------------------------signup----------------------------------
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
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
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        profilePic: newUser.profilePic || "",
      })
      console.log(`Stream user created for ${newUser.fullName}`)
    } catch (error) {
      console.log("Error while upsearting user into stream", error)
    }

    // user created now assigning it a token(ist creat5e token then send it in the cookies)
    // tokebn creation
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    )

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
    res.status(500).json({ message: "Intervbvnal Server Error" })
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

    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
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
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt")
    console.log("execution reached to Logout out Controler")
    res.status(200).json({ success: true, message: "Logout successful" })
  } catch (error) {
    console.log("Error in logout controller", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// -----------------------onboarding----------------------

export const onboarding = async (req, res) => {
  try {
    const userId = req.user._id
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "Missing required fields.",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // fullName,
        // bio,
        // location,
        // nativeLanguage,
        // learningLanguage,
        // equivalent to :
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // updating user for stream(stream related logic not needed if not using stream)

    try {
      await upsertStreamUser({
        userId: updatedUser._id,
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      })
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      )
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      )
    }

    // -------------------------------------------------------------------

    res.status(200).json({ success: true, user: updatedUser })
  } catch (error) {
    console.log("Error in Onboarding Controller!!!", error)
    res.status(500).json({ message: "Internal server Error." })
  }
}
