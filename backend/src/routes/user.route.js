import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendrequest,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js"

const router = express.Router()

// this applies the protected route middleware to every route so no need to do this:
// router.get("/friends", protectRoute, getMyFriends)

router.use(protectRoute)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendrequest)

export default router
