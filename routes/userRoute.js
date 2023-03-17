import { Router } from "express";
import {
  register,
  login,
  logout,
  updateUser,
  generateOTP,
  verifyOTP,
  getUserByUsername,
} from "../controllers/userController.js";
import { Auth } from "../middleware/auth.js";

const userRoute = Router();

userRoute.get("/", (req, res) => {
  res.send("Hello");
});

userRoute.get("/register", (req, res) => {
  res.send("Welcome to register!");
});

userRoute.get("/:username", getUserByUsername);

userRoute.get("/generateOTP", generateOTP);

userRoute.get("/verifyOTP", verifyOTP);

userRoute.post("/register", register);

userRoute.post("/login", login);

userRoute.post("/logout", logout);

userRoute.put("/updateUser/:id", Auth, updateUser);

export default userRoute;
