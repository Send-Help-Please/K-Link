import express from "express";

import * as authController from "../controllers/authController";

const router: express.Express = express();

router.post("/login", authController.controlLogin);
router.post("/register", authController.controlRegister);
router.get("/logout", authController.controlLogout);

export default router;