import { Router } from "express";
import profileRoute from "./profileRoute.js";
import friendRoute from "./friendRoute.js";
const userRoute = Router();

userRoute.use("/profile", profileRoute);
userRoute.use("/friends", friendRoute);

export default userRoute;
