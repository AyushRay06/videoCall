import mongoose from "mongoose"

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "Accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
)

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)
export default FriendRequest
