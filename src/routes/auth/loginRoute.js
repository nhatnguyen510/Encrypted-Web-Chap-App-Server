import { Router } from "express";
import { login } from "../../controllers/authController.js";

const loginRoute = Router();

loginRoute.post("/", login);

export default loginRoute;
