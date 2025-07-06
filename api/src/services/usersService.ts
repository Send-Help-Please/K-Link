import dbHandler from "../database/DBHandler";
import { hashPassword } from "../utils/passwordHandler"
import { PoolClient } from "pg";
import { CREATE_USER, GET_USER_BY_EMAIL, GET_USER_BY_USERNAME } from "../constants/DBQueries";
import { DBResultType, DBResultErrorModel, DBResultSuccessModel } from "../models/DBResultModels";
import { generateVerificationToken } from "../utils/tokenHandler";
import { createVerification } from "./verificationsService";

export const createUser = async (username: string, email: string, password: string, client?: PoolClient): Promise<DBResultType> => {
    const hashResult = await hashPassword(password);
    if(!hashResult.success){
        return hashResult.critical ? 
        new DBResultErrorModel({ critical: true }) : 
        new DBResultErrorModel({ message: hashResult.message });
    };

    const hashedPassword = hashResult.data;
    
    return await dbHandler.runQuery(CREATE_USER, [username, email, hashedPassword], client);
}

export const registerUser = async (username: string, email: string, password: string) => {
    const client = await dbHandler.createClient();
    await dbHandler.startTransaction(client);
    
    const createUserResult = await createUser(username, email, password, client);
    if(!createUserResult.success) return createUserResult;
    
    const userID = createUserResult.data[0].id;

    const tokenResult = generateVerificationToken({ userID });

    if(!tokenResult.success){
        await dbHandler.rollbackTransaction(client);
        return tokenResult.critical ? 
        new DBResultErrorModel({ critical: true }) : 
        new DBResultErrorModel({ message: tokenResult.message });
    }

    const token = tokenResult.data;

    const createVerificationResult = await createVerification(userID, token, "ACCOUNT", client);
    if(!createVerificationResult.success) return createVerificationResult;

    await dbHandler.commitTransaction(client);

    return new DBResultSuccessModel({ data: token, rowCount: 1 });
}

export const getUserByUsername = async (username: string, client?: PoolClient): Promise<DBResultType> => {
    return await dbHandler.runQuery(GET_USER_BY_USERNAME, [username], client);
}

export const getUserByEmail = async (email: string, client?: PoolClient): Promise<DBResultType> => {
    return await dbHandler.runQuery(GET_USER_BY_EMAIL, [email], client);
}