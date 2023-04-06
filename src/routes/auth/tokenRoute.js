import { Router } from "express";
import { refreshToken } from "../../controllers/authController.js";

const tokenRoute = Router();

tokenRoute.post("/refresh-token", refreshToken);

export default tokenRoute;


