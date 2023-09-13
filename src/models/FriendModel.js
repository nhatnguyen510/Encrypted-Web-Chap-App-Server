import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    requested_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    accepted_user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      required: true,
    },
    requested_user_public_key: {
      type: String,
    },
    accepted_user_public_key: {
      type: String,
    },
  },
  { timestamps: true }
);

const FriendModel = mongoose.model("Friend", friendSchema);
export default FriendModel;
