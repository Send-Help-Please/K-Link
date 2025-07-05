import express from "express";

import authRouter from "./authRouter";

const router: express.Express = express();

router.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: "API is running" });
});

router.use("/auth", authRouter);

export default router;