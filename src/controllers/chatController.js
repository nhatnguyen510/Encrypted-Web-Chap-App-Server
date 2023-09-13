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
  const { userId } = req.user;
  const { receiver_id } = req.params;

  try {
    const conversation = await ConversationModel.findOne({
      participants: { $all: [userId, receiver_id] },
    }).populate("lastMessage");

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

export const getConversations = async (req, res) => {
  const { userId } = req.user;

  try {
    const conversations = await ConversationModel.find({
      participants: { $in: [userId] },
    }).populate("lastMessage");

    console.log({ conversations });

    if (!conversations) {
      return res.status(404).json({
        message: "Cannot find Conversations!",
      });
    }

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const sendMessage = async (req, res) => {
  const { conversation_id, sender_id, message } = req.body;

  //check if sender is in conversation
  const conversation = await ConversationModel.findOne({
    _id: conversation_id,
    participants: {
      $in: [sender_id],
    },
  });

  if (!conversation) {
    return res.status(401).json({
      message: "You are not allowed to send messages to this conversation!",
    });
  }

  try {
    const newMessage = new MessageModel({
      conversation_id,
      sender_id,
      message,
    });

    const savedMessage = await newMessage.save();

    const updatedConversation = await ConversationModel.findOneAndUpdate(
      {
        _id: conversation_id,
      },
      {
        lastMessage: savedMessage._id,
        lastMessageAt: savedMessage.createdAt,
      },
      {
        new: true,
      }
    ).populate("lastMessage");

    res.status(200).json({ savedMessage, updatedConversation });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const seenMessage = async (req, res) => {
  const { conversation_id } = req.body;
  const { userId } = req.user;

  //check if user is in conversation
  const conversation = await ConversationModel.findOne({
    _id: conversation_id,
    participants: {
      $in: [userId],
    },
  });

  if (!conversation) {
    return res.status(401).json({
      message: "You are not allowed to see messages in this conversation!",
    });
  }

  try {
    const seenMessage = await MessageModel.updateMany(
      {
        conversation_id,
        sender_id: { $ne: userId },
      },
      {
        seen: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json(seenMessage);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessages = async (req, res) => {
  const { conversation_id } = req.params;
  const { userId } = req.user;

  //check if user is in conversation
  const conversation = await ConversationModel.findOne({
    _id: conversation_id,
    participants: {
      $in: [userId],
    },
  });

  if (!conversation) {
    return res.status(401).json({
      message: "You are not allowed to get messages in this conversation!",
    });
  }

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
