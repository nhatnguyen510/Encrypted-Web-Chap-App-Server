import { Router } from "express";
import {
  verifyUsername,
  verifyEmail,
} from "../../controllers/authController.js";

const verificationRoute = Router();

verificationRoute.post("/username", verifyUsername);
verificationRoute.post("/email", verifyEmail);

export default verificationRoute;
