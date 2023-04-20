import { Router } from "express";
import conversationRoute from "./conversation/conversationRoute.js";
const chatRoute = Router();

chatRoute.use("/conversation", conversationRoute);

export default chatRoute;
