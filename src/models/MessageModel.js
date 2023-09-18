import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.plugin(mongoosePaginate);

const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
