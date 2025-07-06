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

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id

    // get all the pendding request where current user is the recipient ans get some senders details
    const incomingRequest = await FriendRequest.find({
      recipent: userId,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")
    // get all the request where the CurrentUser is the sender and the status is accepetd
    const acceptedRequest = await FriendRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("recipient", "fullName profilePic")

    res.status(200).json({ incomingRequest, acceptedRequest })
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message)
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
