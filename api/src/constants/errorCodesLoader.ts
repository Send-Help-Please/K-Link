import * as ERROR_KEYS from "./DBErrorKeys";
import { USERNAME, EMAIL, TOKEN } from "./Parameters";
import dbHandler from "../database/DBHandler";
import { GET_ERROR_CODES } from "./DBQueries";
import { ERROR_FETCHING_ERROR_CODES } from "./DBErrorMessages";
import ERROR_CODES from "./DBErrorCodes";

const errorKeyToCodeMap: Record<string, string> = {
    [ERROR_KEYS.USERNAME_TAKEN]: USERNAME,
    [ERROR_KEYS.EMAIL_TAKEN]: EMAIL,
    [ERROR_KEYS.TOKEN_TAKEN]: TOKEN,
    [ERROR_KEYS.TOKEN_NOT_FOUND]: TOKEN,
    [ERROR_KEYS.TOKEN_EXPIRED]: TOKEN,
    [ERROR_KEYS.USER_NOT_FOUND]: USERNAME
};

const loadDBErrors = async () => {
    try {
        const result = await dbHandler.runQuery(GET_ERROR_CODES, []);
        if(!result.success){
            throw new Error(result.message || ERROR_FETCHING_ERROR_CODES);
        }

        if(!result.rowCount){
            return;
        }

        for(let i = 0; i < result.rowCount; i++){
            const errorCode = result.data[i].code;
            const errorMessage = result.data[i].message;
            const fieldKey = errorKeyToCodeMap[errorCode];
            ERROR_CODES.push({ errorCode, errorMessage, fieldKey });
        }
    } catch (e) {
        throw new Error(e instanceof Error ? e.message : ERROR_FETCHING_ERROR_CODES);
    }
}

export default loadDBErrors;