import { Router } from "express";
import { logout } from "../../controllers/authController.js";

const logoutRoute = Router();

logoutRoute.get("/:userId", logout);

export default logoutRoute;
