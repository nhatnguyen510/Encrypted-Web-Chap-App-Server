import { Router } from "express";
import loginRoute from "./loginRoute.js";
import otpRoute from "./otpRoute.js";
import registerRoute from "./registerRoute.js";
import tokenRoute from "./tokenRoute.js";
import logoutRoute from "./logoutRoute.js";
import { Auth } from "../../middleware/auth.js";

const authRoute = Router();

authRoute.use("/register", registerRoute);

authRoute.use("/login", loginRoute);

authRoute.use("/logout", Auth, logoutRoute);

authRoute.use("/otp", otpRoute);

authRoute.use("/token", tokenRoute);

export default authRoute;
