import { Request, Response } from "express";

import { USERNAME, EMAIL, PASSWORD, PASSWORD_REPEAT } from "../constants/Parameters";
import validateRegister from "../validations/registerValidator";
import { generateResponseBadRequest, generateResponseInternalServerError, generateResponseOK } from "../utils/responseGenerator";
import * as ValidationModels from "../models/ValidationModels";
import { registerUser } from "../services/usersService";

export const controlLogin = async (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
};

export const controlRegister = async (req: Request, res: Response) => {
    const usernameP: unknown = req.body[USERNAME];
    const emailP: unknown = req.body[EMAIL];
    const passwordP: unknown = req.body[PASSWORD];
    const passwordRepeatP: unknown = req.body[PASSWORD_REPEAT];

    const result: ValidationModels.MassValidationType = await validateRegister(usernameP, emailP, passwordP, passwordRepeatP);

    if(!result.success){
        result.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, 'Validation error', result.errorMessages);
        return;
    }
    
    const username = result.data[USERNAME];
    const email = result.data[EMAIL];
    const password = result.data[PASSWORD];

    const registerResult = await registerUser(username, email, password);
    if(!registerResult.success){
        registerResult.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, registerResult.message);
        return;
    }
    
    generateResponseOK(res, "Registered Successfully", registerResult.data);
};

export const controlLogout = async (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
};

export const controlToken = async (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
}