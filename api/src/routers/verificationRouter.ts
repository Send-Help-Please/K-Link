import express from "express";

import * as verificationController from "../controllers/verificationController";

const router: express.Express = express();

router.get("/account/:token", verificationController.controlAccountVerification);

export default router;