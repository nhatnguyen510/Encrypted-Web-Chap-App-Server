import { Router } from "express";
import { verifyOTP, generateOTP } from "../../controllers/authController.js";

const otpRoute = Router();

// otpRoute.post("/generateOTP", generateOTP);

otpRoute.post("/verifyOTP", verifyOTP);

export default otpRoute;
