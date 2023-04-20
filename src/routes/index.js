import { Router } from "express";

import authRoute from "./auth/index.js";
import userRoute from "./user/index.js";
import chatRoute from "./chat/index.js";
import { Auth } from "../middleware/auth.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", Auth, userRoute);
router.use("/chat", Auth, chatRoute);

export default router;
