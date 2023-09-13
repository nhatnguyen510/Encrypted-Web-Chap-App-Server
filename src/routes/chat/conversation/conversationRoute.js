import { Router } from "express";
import {
  getConversation,
  getConversations,
  createConversation,
} from "../../../controllers/chatController.js";
import messageRoute from "./messages/messageRoute.js";

const conversationRoute = Router();

conversationRoute.get("/", getConversations);

conversationRoute.get("/:receiver_id", getConversation);

conversationRoute.post("/", createConversation);

conversationRoute.use("/message", messageRoute);

export default conversationRoute;
