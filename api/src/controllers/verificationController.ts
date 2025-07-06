import { Request, Response } from "express";
import { TOKEN } from "../constants/Parameters";
import validateToken from "../validations/tokenValidator";
import { generateResponseBadRequest, generateResponseInternalServerError, generateResponseOK } from "../utils/responseGenerator";
import { decodeVerificationToken } from "../utils/tokenHandler";
import { completeAccountVerification } from "../services/verificationsService";

export const controlAccountVerification = async (req: Request, res: Response) => {
    const tokenP: unknown = req.params[TOKEN];
    
    const validationResult = await validateToken(tokenP);
    if(!validationResult.success){
        validationResult.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, validationResult.errorMessages && validationResult.errorMessages[0]);
        return;
    }
    
    const token = validationResult.data;

    const decodeResult = decodeVerificationToken(token);
    if(!decodeResult.success){
        decodeResult.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, decodeResult.message);
        return;
    }

    const verifyResult = await completeAccountVerification(token);
    if(!verifyResult.success){
        verifyResult.critical ? generateResponseInternalServerError(res) : generateResponseBadRequest(res, verifyResult.message);
        return;
    }

    generateResponseOK(res, "Account Verified Successfully");
}

export const controlEmailVerification = async (req: Request, res: Response) => {
    
}

export const controlPasswordReset = async (req: Request, res: Response) => {
    
}