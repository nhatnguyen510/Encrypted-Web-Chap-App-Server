import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    encrypted_session_key: {
      type: String,
    },
    lastMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const ConversationModel = mongoose.model("Conversation", conversationSchema);
export default ConversationModel;
