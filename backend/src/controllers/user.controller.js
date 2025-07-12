import FriendRequest from "../modals/friendRequest.js"
import User from "../modals/User.js"

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id
    const currentUser = req.user

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, //exclude current user
        { _id: { $nin: currentUser.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    })
    res.status(200).json(recommendedUsers)
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      )

    res.status(200).json(user.friends)
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message)
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

export const acceptFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id
    const { id: requestId } = req.params
    const friendRequest = await FriendRequest.findById(requestId)

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" })
    }

    // verify the current user is the recipient
    if (friendRequest.recipient.toString() !== myId) {
      return res.status(403).json({
        message: "You are not authorized to accept this request",
      })
    }

    friendRequest.status = "accepted"
    await friendRequest.save()
    // the frienRequest model is updated but now we need t o add the users to each others friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    })

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    })
    res.status(200).json({ message: "Friend request accepted" })
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
// TODO:need to check if correct or not
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id
    const requestId = req.params

    const request = await FriendRequest.findById(requestId)
    if (!request) {
      return res.status(400).json({ message: "Request does not exist" })
    }

    await FriendRequest.findByIdAndDelete(requestId)
  } catch (error) {}
}

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id

    // get all the pendding request where current user is the recipient ans get some senders details
    const incomingReqs = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")
    // get all the request where the CurrentUser is the sender and the status is accepetd
    const acceptedReqs = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("recipient", "fullName profilePic")

    res.status(200).json({ incomingReqs, acceptedReqs })
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getOutgoingFriendrequest = async (req, res) => {
  try {
    const userId = req.user.id

    const outgoingRequest = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    )

    res.status(200).json(outgoingRequest)
  } catch (error) {
    console.log("Error in GetoutgoingRequest", error.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
