import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "../constants/ENVParameters";
import handleConfig from "./configHandler";

const dbConfigList = [
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE
] as const;

const DB_CONFIG = handleConfig(dbConfigList);

export default DB_CONFIG;