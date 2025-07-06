import FriendRequest from "../modals/friendRequest"
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

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id
    const { id: recipientId } = req.params

    // Prevent sending request to my self

    if (myId === recipientId) {
      return res.status(404).json({ message: "Invalid request" })
    }

    // Check if the recipent exist

    const recipent = await User.findById(recipientId)

    if (!recipent) {
      return res.status(404).json({ message: "Invalid request" })
    }

    // Checks if the user is already friends with the recipient
    if (recipent.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" })
    }

    // Check if the request already exist
    const existingrequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    })

    if (existingrequest) {
      return res.status(400).json({
        message: "Requerst already exist between the sender and the recipient.",
      })
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    })

    res.status(200).json(friendRequest)
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
