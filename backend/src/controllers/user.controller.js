import User from "../modals/User"

export const getRecommendedUsers = async (req, res) => {
  try {
    //As we already have the user from protected route we can access users properties by "."
    const currentUserId = req.user._id //req.user.id also works
    const currentUser = req.user

    const recommendeFriends = await User.find({
      // $and allow us to put multiple conndition on CRUD operation
      $and: [
        { _id: { $ne: currentUser } }, // ne:not equal to excludes current user
        { _id: { $nin: currentUser.friends } }, //nin: not in the current user friends Excludes the friends of current user
        { isOnboarded: true }, // includes only onboarded users
      ],
    })

    res.status(200).json(recommendeFriends)
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id

    const friends = await User.findById(currentUserId)
      .select("friends") //selects teh current user friends(which is array of userIds)
      .populate(
        //usnig teh userId we select all the necessary fields of them
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      )

    res.status(200).json(friends)
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
