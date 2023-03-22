import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { config } from "../config/index.js";
import otpGenerator from "otp-generator";
import UserOTPVerificationModel from "../models/UserOTPVerificationModel.js";
import { transporter } from "../config/email.js";

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

    const savedUser = await newUser.save();

    console.log({ savedUser });

    await sendOTPVerificationEmail(savedUser);

    return res.status(200).json({
      message: "Register successfully. Check your email for verification!",
      data: {
        user_id: savedUser._id,
        username: savedUser.username,
      },
    });
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

export const generateOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    alphabets: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    digits: true,
  });

  return otp;
};

export const verifyOTP = async (req, res) => {
  const { user_id, otp } = req.body;

  try {
    const userOTPVerification = await UserOTPVerificationModel.findOne({
      user_id,
    });

    if (!userOTPVerification) {
      return res.status(404).json({
        message: "OTP not found!",
      });
    }

    if (userOTPVerification.expiredAt < new Date()) {
      return res.status(400).json({
        message: "OTP has expired!",
      });
    }

    if (otp != userOTPVerification.otp) {
      return res.status(400).json({
        message: "OTP is incorrect!",
      });
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userOTPVerification.user_id },
      { is_verified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    await UserOTPVerificationModel.findOneAndDelete({ user_id, otp });

    return res.status(200).json({
      message: "Verify OTP successfully!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong while verify OTP.",
    });
  }
};

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

const sendOTPVerificationEmail = async (user) => {
  const { _id, email } = user;

  const otp = generateOTP();

  try {
    const mailOptions = {
      from: `${config.MAILER.MAILER_FROM} <${config.MAILER.MAILER_USERNAME}>`,
      to: email,
      subject: "[OTP Verification code]",
      text: `Your OTP is ${otp}`,
    };

    const newOTPVerification = new UserOTPVerificationModel({
      user_id: _id,
      otp,
      createdAt: Date.now(),
      expiredAt: Date.now() + 60000,
    });

    await newOTPVerification.save();

    const response = await transporter.sendMail(mailOptions);

    return response;
  } catch (err) {
    console.log(err);
  }
};
