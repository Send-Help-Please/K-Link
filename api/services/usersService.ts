import dbHandler from "../database/DBHandler";
import { hashPassword } from "../utils/passwordHandler"
import { PoolClient } from "pg";
import { CREATE_USER } from "../constants/DBQueries";
import { DBResultType, DBResultErrorModel } from "../models/DBResultModels";

export const createUser = async (username: string, email: string, password: string, client?: PoolClient): Promise<DBResultType> => {
    const hashResult = await hashPassword(password);
    if(!hashResult.success){
        return hashResult.critical ? 
        new DBResultErrorModel(undefined, undefined, undefined, true) : 
        new DBResultErrorModel(undefined, undefined, hashResult.message);
    };

    const hashedPassword = hashResult.data;
    
    return await dbHandler.runQuery(CREATE_USER, [username, email, hashedPassword], client);
}

export const registerUser = async () => {

}