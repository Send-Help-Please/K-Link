import express from "express";

import router from "./routers/router";
import API_CONFIG from "./configs/APIConfig";
import errorHandler from "./middlewares/errorHandlerMiddleware";
import loadDBErrors from "./constants/errorCodesLoader";

loadDBErrors();
const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/${API_CONFIG.API_ROOT}`, router);

app.use(errorHandler);

app.listen(+API_CONFIG.API_PORT, API_CONFIG.API_HOST, () => {
    console.log(`Server is running on ${API_CONFIG.API_HOST}:${API_CONFIG.API_PORT}`);
});