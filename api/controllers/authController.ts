import { Request, Response } from "express";

import { USERNAME, EMAIL, PASSWORD } from "../constants/Parameters";
import validateRegister from "../validations/registerValidator";
import { generateResponseBadRequest, generateResponseInternalServerError, generateResponseOK } from "../utils/responseGenerators";
import * as ValidationModels from "../models/ValidationModels";
import { generateVerificationToken } from "../utils/tokenGenerator";

export const controlLogin = async (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
};

export const controlRegister = async (req: Request, res: Response) => {
    const usernameP: unknown = req.body[USERNAME];
    const emailP: unknown = req.body[EMAIL];
    const passwordP: unknown = req.body[PASSWORD];

    const result: ValidationModels.MassValidationType = await validateRegister(usernameP, emailP, passwordP);
    if(!result.success){
        result.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, 'Validation error', result.errorMessages);
        return;
    }

    const tokenProcess = generateVerificationToken({ username: result.data[USERNAME] });
    if(!tokenProcess.success){
        generateResponseInternalServerError(res);
        return;
    }

    generateResponseOK(res, "Validation Successful", tokenProcess.data);
};

export const controlLogout = async (req: Request, res: Response) => {
    res.status(200).json({ message: "API is running" });
};