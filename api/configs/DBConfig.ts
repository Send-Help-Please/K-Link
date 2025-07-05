import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "../constants/ENVParameters";
import handleConfig, { ConfigObjectI } from "./configHandler";

const dbConfigObject: ConfigObjectI[] = [
    { name: "user", key: DB_USER },
    { name: "password", key: DB_PASSWORD },
    { name: "host", key: DB_HOST },
    { name: "port", key: DB_PORT },
    { name: "database", key: DB_DATABASE }
]

const DB_CONFIG = handleConfig(dbConfigObject);

export default DB_CONFIG;