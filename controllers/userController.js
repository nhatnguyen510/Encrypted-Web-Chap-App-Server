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

    // If not, create a new user object with provided information
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

    // Save the new user object to the database
    await newUser.save();

    // Send a success response
    res.status(200).json({ message: "Registration was successful" });
  } catch (error) {
    // Handle any errors that occur during registration
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while registering the user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
};

export const updateUser = async (req, res) => {};

export const generateOTP = async (req, res) => {};

export const verifyOTP = async (req, res) => {};

export const logout = async (req, res) => {};
