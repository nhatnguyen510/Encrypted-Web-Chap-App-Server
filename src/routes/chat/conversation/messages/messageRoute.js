import { Router } from "express";
import {
  getMessages,
  sendMessage,
} from "../../../../controllers/chatController.js";

const messageRoute = Router();

messageRoute.get("/:conversation_id", getMessages);

messageRoute.post("/", sendMessage);

export default messageRoute;
