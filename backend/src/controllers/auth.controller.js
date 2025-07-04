import User from "../modals/User"

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
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`\

        const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });
  } catch (error) {}
}

export const login = () => {
  try {
    const { fullname, email, password } = req.body
  } catch (error) {}
}
export const logout = () => {
  try {
    const { fullname, email, password } = req.body
  } catch (error) {}
}
