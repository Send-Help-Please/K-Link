import express from "express";

import router from "./routers/router";
import API_CONFIG from "./configs/APIConfig";
import invalidJsonHandler from "./middlewares/invalidJSONMiddleware";

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/${API_CONFIG.root}`, router);

app.use(invalidJsonHandler);

app.listen(+API_CONFIG.port, API_CONFIG.host, () => {
    console.log(`Server is running on ${API_CONFIG.host}:${API_CONFIG.port}`);
});