import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { config } from "../config/index.js";

export const register = async (req, res) => {
  const {
    username,
    password,
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    photo_url,
  } = req.body;

  try {
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email is already taken!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      photo_url,
    });

    await newUser.save();

    return res.status(200).json({ message: "Registration was successful" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while registering the user." });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Your username is incorrect!" });
    }

    const checkedPassword = await bcrypt.compare(password, user.password);

    if (!checkedPassword) {
      return res.status(400).json({
        message: "Your password is incorrect!",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const updatedUser = await UserModel.findOneAndUpdate(
      { username: user.username },
      { refresh_token: refreshToken },
      { new: true }
    );

    console.log(updatedUser);

    return res.status(200).json({
      message: "Login successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while login." });
  }
};

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

export const generateOTP = async (req, res) => {};

export const verifyOTP = async (req, res) => {};

export const logout = async (req, res) => {};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const payload = jwt.verify(
      refreshToken,
      config.SECRET.REFRESH_TOKEN_SECRET
    );
    const user = await UserModel.findById(payload.userId);

    console.log({ payload, user });

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token." });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Something wrong while refreshing token." });
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    config.SECRET.ACCESS_TOKEN_SECRET,
    { expiresIn: "60s" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    config.SECRET.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}
