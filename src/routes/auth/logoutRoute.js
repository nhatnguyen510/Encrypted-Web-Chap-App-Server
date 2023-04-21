import { Router } from "express";
import { logout } from "../../controllers/authController.js";

const logoutRoute = Router();

logoutRoute.post("/", logout);

export default logoutRoute;
