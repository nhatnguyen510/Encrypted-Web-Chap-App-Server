import { Router } from "express";
import { register } from "../../controllers/userController.js";

const registerRoute = Router();

registerRoute.post("/", register);

export default registerRoute;
