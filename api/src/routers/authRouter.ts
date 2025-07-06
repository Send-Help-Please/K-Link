import express from "express";

import * as authController from "../controllers/authController";
import verificationRouter from "./verificationRouter";

const router: express.Express = express();

router.post("/login", authController.controlLogin);
router.post("/register", authController.controlRegister);
router.get("/logout", authController.controlLogout);
router.get("/token", authController.controlToken);

router.use("/verify", verificationRouter);

export default router;