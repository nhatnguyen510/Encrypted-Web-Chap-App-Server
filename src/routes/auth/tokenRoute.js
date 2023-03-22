import { Router } from "express";
import { refreshToken } from "../../controllers/userController.js";

const tokenRoute = Router();

tokenRoute.post("/refresh-token", refreshToken);

export default tokenRoute;
