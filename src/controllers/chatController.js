import ConversationModel from "../models/ConversationModel.js";
import MessageModel from "../models/MessageModel.js";

export const createConversation = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    const newConversation = new ConversationModel({
      participants: [sender_id, receiver_id],
    });

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (e) {
    res.status(500).json(e);
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversation = await ConversationModel.find({
      participants: { $in: [userId] },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Cannot find Conversation!",
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const sendMessage = async (req, res) => {
  const { conversation_id, sender_id, receiver_id, message } = req.body;

  try {
    const newMessage = new MessageModel({
      conversation_id,
      sender_id,
      receiver_id,
      message,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { conversation_id } = req.params;

  try {
    const messages = await MessageModel.find({
      conversation_id,
    });

    if (!messages) {
      return res.status(404).json({
        message: "Cannot find Messages!",
      });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};
