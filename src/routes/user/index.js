import { Router } from "express";
import profileRoute from "./profileRoute.js";
const userRoute = Router();

userRoute.use("/profile", profileRoute);

export default userRoute;
