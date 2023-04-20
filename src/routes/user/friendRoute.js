import { Router } from "express";
import {
  acceptFriendRequest,
  getFriends,
  sendFriendRequest,
} from "../../controllers/userController.js";

const friendRoute = Router();

friendRoute.get("/", getFriends);

friendRoute.post("/sendFriendRequest", sendFriendRequest);

friendRoute.post("/acceptFriendRequest", acceptFriendRequest);

export default friendRoute;
