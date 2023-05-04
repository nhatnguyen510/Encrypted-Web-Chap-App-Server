import { Router } from "express";
import {
  acceptFriendRequest,
  getFriendRequest,
  getFriends,
  sendFriendRequest,
} from "../../controllers/userController.js";

const friendRoute = Router();

friendRoute.get("/", getFriends);

friendRoute.get("/getFriendRequest", getFriendRequest);

friendRoute.post("/sendFriendRequest", sendFriendRequest);

friendRoute.post("/acceptFriendRequest", acceptFriendRequest);

export default friendRoute;
