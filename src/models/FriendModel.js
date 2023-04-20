import mongoose from "mongoose";

const friendSchema = new mongoose.Schema(
  {
    requested_user_id: {
      type: String,
    },
    accepted_user_id: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      required: true,
    },
  },
  { timestamps: true }
);

const FriendModel = mongoose.model("Friend", friendSchema);
export default FriendModel;
