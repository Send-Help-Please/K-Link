import { API_HOST, API_PORT, API_ROOT } from "../constants/ENVParameters";
import handleConfig, { ConfigObjectI } from "./configHandler";

const apiConfigObject: ConfigObjectI[] = [
    { name: "port", key: API_PORT },
    { name: "host", key: API_HOST },
    { name: "root", key:  API_ROOT}
]

const API_CONFIG = handleConfig(apiConfigObject);

export default API_CONFIG;