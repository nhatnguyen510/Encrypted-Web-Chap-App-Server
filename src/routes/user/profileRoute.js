import { Router } from "express";
import { updateUser } from "../../controllers/userController.js";
import { Auth } from "../../middleware/auth.js";

const profileRoute = Router();

profileRoute.put("/updateUser/:id", updateUser);

export default profileRoute;
