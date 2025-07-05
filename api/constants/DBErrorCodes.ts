import * as ERROR_KEYS from "./DBErrorKeys";
import { USERNAME, EMAIL, TOKEN } from "./Parameters";
import dbHandler from "../database/DBHandler";
import { GET_ERROR_CODES } from "./DBQueries";
import { ERROR_FETCHING_ERROR_CODES } from "./DBErrorMessages";
 
interface DBErrorCodeI {
    errorCode: string,
    errorMessage?: string,
    fieldKey?: string
}

const ERROR_CODES: DBErrorCodeI[] = [];

const errorKeyToCodeMap = {
    [ERROR_KEYS.USERNAME_TAKEN]: USERNAME,
    [ERROR_KEYS.EMAIL_TAKEN]: EMAIL,
    [ERROR_KEYS.TOKEN_TAKEN]: TOKEN
};

const loadDBErrors = async () => {
    const client = await dbHandler.createClient();
    const result = await dbHandler.runQuery(GET_ERROR_CODES);
    client.release();
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
}

loadDBErrors();

export default ERROR_CODES;