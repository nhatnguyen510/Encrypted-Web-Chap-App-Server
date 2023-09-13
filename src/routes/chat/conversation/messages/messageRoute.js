import { Router } from "express";
import {
  getMessages,
  sendMessage,
  seenMessage,
} from "../../../../controllers/chatController.js";

const messageRoute = Router();

messageRoute.get("/:conversation_id", getMessages);

messageRoute.post("/", sendMessage);

messageRoute.post("/seen", seenMessage);

export default messageRoute;
