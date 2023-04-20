import UserModel from "../models/UserModel.js";
import FriendModel from "../models/FriendModel.js";

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
      userId: { $in: friendIds },
    }).select("-password -is_verified -refresh_token");

    res.json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export const sendFriendRequest = async (req, res) => {
  const requested_user_id = req.user.userId;
  const { accepted_user_id } = req.body;

  try {
    const newFriendRequest = new FriendModel({
      requested_user_id,
      accepted_user_id,
      status: "Pending",
    });
    const savedFriendRequest = await newFriendRequest.save();
    res.status(200).json(savedFriendRequest);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const acceptFriendRequest = async (req, res) => {
  const accepted_user_id = req.user.userId;
  const { requested_user_id } = req.body;
  try {
    const friendRequest = await FriendModel.findOneAndUpdate(
      {
        requested_user_id,
        accepted_user_id,
        status: "Pending",
      },
      { status: "Accepted" },
      { new: true }
    );
    if (!friendRequest) {
      return res.status(404).send("Friend request not found");
    }
    res.status(200).json(friendRequest);
  } catch (error) {
    res.status(500).json(error);
  }
};
