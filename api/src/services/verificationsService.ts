import { PoolClient } from "pg";
import { CREATE_VERIFICATION } from "../constants/DBQueries";
import dbHandler from "../database/DBHandler";
import { DBResultType } from "../models/DBResultModels";
import VerificationType from "../constants/VerificationTypes";

export const createVerification = async (userID: number, token: string, type: VerificationType, client?: PoolClient): Promise<DBResultType> => {
    return await dbHandler.runQuery(CREATE_VERIFICATION, [userID, token, type], client);
}

export const completeVerification = async (token: string, type: VerificationType, client?: PoolClient): Promise<DBResultType> => {
    return await dbHandler.runQuery("SELECT * FROM complete_verification($1, $2)", [token, type], client);
}

export const completeAccountVerification = async (token: string, client?: PoolClient): Promise<DBResultType> => {
    return await completeVerification(token, "ACCOUNT", client);
}