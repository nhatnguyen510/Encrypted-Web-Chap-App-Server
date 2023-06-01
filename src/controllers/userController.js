import UserModel from "../models/UserModel.js";
import FriendModel from "../models/FriendModel.js";
import ConversationModel from "../models/ConversationModel.js";
import mongoose from "mongoose";

export const updateUser = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        message: "Cannot find User!",
      });
    } else {
      return res.status(200).json({
        message: "Update user successfully!",
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while updating user." });
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username }).select("-password");

    if (user) {
      return res.status(200).json({
        user,
      });
    } else {
      return res.status(404).json({
        message: "User not found!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong while got user.",
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.user;
    const friends = await FriendModel.find({
      $or: [{ requested_user_id: userId }, { accepted_user_id: userId }],
      status: "Accepted",
    });

    const friendIds = friends.map((friend) =>
      friend.requested_user_id === userId
        ? friend.accepted_user_id
        : friend.requested_user_id
    );

    const friendsInfo = await UserModel.find({
      _id: { $in: friendIds },
    }).select("_id username first_name last_name");

    res.status(200).json(friendsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const { userId } = req.user;
    const friendRequests = await FriendModel.find({
      accepted_user_id: userId,
      status: "Pending",
    });

    if (!friendRequests) {
      return res.status(404).json({
        message: "Cannot find friend requests",
      });
    }

    const friendRequestIds = friendRequests.map(
      (friendRequest) => friendRequest.requested_user_id
    );

    const friendRequestsInfo = await UserModel.find({
      _id: { $in: friendRequestIds },
    }).select("_id username first_name last_name");

    res.status(200).json(friendRequestsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const sendFriendRequest = async (req, res) => {
  const requested_user_id = req.user.userId;
  const { accepted_user_id, requested_user_public_key } = req.body;

  if (!accepted_user_id) {
    return res.status(400).json({
      message: "Accepted user id is required",
    });
  }

  if (requested_user_id === accepted_user_id) {
    return res.status(400).json({
      message: "Cannot send friend request to yourself",
    });
  }

  const existedUser = await UserModel.findById(accepted_user_id);

  if (!existedUser) {
    return res.status(404).json({
      message: "Accepted user not found",
    });
  }

  const existedFriendRequest = await FriendModel.findOne({
    $or: [
      {
        requested_user_id,
        accepted_user_id,
      },
      {
        requested_user_id: accepted_user_id,
        accepted_user_id: requested_user_id,
      },
    ],
  });

  if (existedFriendRequest?.status === "Pending") {
    return res.status(400).json({
      message: "Friend request already sent",
    });
  }

  if (existedFriendRequest?.status === "Accepted") {
    return res.status(400).json({
      message: "Friend request already accepted",
    });
  }

  try {
    const newFriendRequest = new FriendModel({
      requested_user_id,
      accepted_user_id,
      status: "Pending",
      requested_user_public_key,
    });
    const savedFriendRequest = await newFriendRequest.save();
    res.status(200).json(savedFriendRequest);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const acceptFriendRequest = async (req, res) => {
  const accepted_user_id = req.user.userId;
  const { requested_user_id, accepted_user_public_key } = req.body;

  if (!requested_user_id) {
    return res.status(400).json({
      message: "Requested user id is required",
    });
  }

  if (accepted_user_id === requested_user_id) {
    return res.status(400).json({
      message: "Cannot accept friend request to yourself",
    });
  }

  const existedUser = await UserModel.findById(requested_user_id);
  if (!existedUser) {
    return res.status(404).json({
      message: "Requested user not found",
    });
  }

  const existedFriendRequest = await FriendModel.findOne({
    $or: [
      {
        requested_user_id,
        accepted_user_id,
      },
      {
        requested_user_id: accepted_user_id,
        accepted_user_id: requested_user_id,
      },
    ],
  });

  if (!existedFriendRequest) {
    return res.status(400).json({
      message: "Friend request not found",
    });
  }

  if (existedFriendRequest.status === "Accepted") {
    return res.status(400).json({
      message: "Friend request already accepted",
    });
  }

  if (
    existedFriendRequest.requested_user_id === accepted_user_id &&
    existedFriendRequest.status === "Pending"
  ) {
    return res.status(400).json({
      message: "You cannot accept your own friend request",
    });
  }

  try {
    const friendRequest = await FriendModel.findOneAndUpdate(
      {
        requested_user_id,
        accepted_user_id,
        status: "Pending",
      },
      { status: "Accepted", accepted_user_public_key },
      { new: true }
    );

    console.log({ friendRequest });

    const newConversation = new ConversationModel({
      participants: [requested_user_id, accepted_user_id],
    });

    await newConversation.save();
    const savedFriendRequest = await friendRequest.save();

    res.status(200).json(savedFriendRequest);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserFriendIds = async (userId) => {
  const friends = await FriendModel.find({
    $or: [{ requested_user_id: userId }, { accepted_user_id: userId }],
    status: "Accepted",
  });

  if (!friends) {
    return [];
  }

  const friendIds = friends.map((friend) =>
    friend.requested_user_id === userId
      ? friend.accepted_user_id
      : friend.requested_user_id
  );

  return friendIds;
};
