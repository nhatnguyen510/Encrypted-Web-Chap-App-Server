import { Router } from "express";

import authRoute from "./auth/index.js";
import userRoute from "./user/index.js";

const router = Router();

router.use("/user", userRoute);
router.use("/auth", authRoute);

export default router;
