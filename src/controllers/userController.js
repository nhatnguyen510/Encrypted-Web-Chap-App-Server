import UserModel from "../models/UserModel.js";

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
