import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";

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

    res.status(200).json({ message: "Registration was successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while registering the user" });
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

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Login successfully!",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
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
    res.status(500).json({ message: "Something went wrong while logining!" });
  }
};

export const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username }).select("-password");

    if (user) {
      res.status(200).json({
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong while got user!",
    });
  }
};

export const generateOTP = async (req, res) => {};

export const verifyOTP = async (req, res) => {};

export const logout = async (req, res) => {};
