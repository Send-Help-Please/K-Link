import { API_HOST, API_PORT, API_ROOT } from "../constants/ENVParameters";
import handleConfig from "./configHandler";

const apiConfigList = [API_HOST, API_PORT, API_ROOT] as const;

const API_CONFIG = handleConfig(apiConfigList);

export default API_CONFIG;