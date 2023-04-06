import { Router } from "express";
import { register } from "../../controllers/authController.js";
import { validateUser } from "../../middleware/validateUser.js";

const registerRoute = Router();

registerRoute.post("/", validateUser, register);

export default registerRoute;
