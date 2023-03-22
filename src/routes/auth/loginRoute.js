import { Router } from "express";
import { login } from "../../controllers/userController.js";

const loginRoute = Router();

loginRoute.post("/", login);

export default loginRoute;
