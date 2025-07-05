import { 
    JWT_ACCESS_EXPIRATION_TIME, 
    JWT_ACCESS_SECRET, 
    JWT_REFRESH_EXPIRATION_TIME, 
    JWT_REFRESH_SECRET, 
    JWT_VERIFICATION_EXPIRATION_TIME, 
    JWT_VERIFICATION_SECRET 
} from "../constants/ENVParameters";
import handleConfig, { ConfigObjectI } from "./configHandler";

const jwtConfigObject: ConfigObjectI[] = [
    { name: "verificationSecret", key: JWT_VERIFICATION_SECRET },
    { name: "verificationExpirationTime", key: JWT_VERIFICATION_EXPIRATION_TIME },
    { name: "accessSecret", key: JWT_ACCESS_SECRET },
    { name: "accessExpirationTime", key: JWT_ACCESS_EXPIRATION_TIME },
    { name: "refreshSecret", key: JWT_REFRESH_SECRET }, 
    { name: "refreshExpirationTime", key: JWT_REFRESH_EXPIRATION_TIME }
]

const JWT_CONFIG = handleConfig(jwtConfigObject);

export default JWT_CONFIG;