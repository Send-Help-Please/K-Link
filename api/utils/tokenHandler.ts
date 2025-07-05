import jsonwebtoken, { JwtPayload, Secret, TokenExpiredError, JsonWebTokenError, SignOptions } from "jsonwebtoken"; 
import { ProcessResultError, ProcessResultSuccess, ProcessResultType } from "../models/ProcessResultModels";
import JWT_CONFIG from "../configs/JWTConfig";

type StringValue = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

const generateToken = (payload: object, secret: Secret, options?: SignOptions): ProcessResultType => {
    try{
        payload["uid"] = Date.now();
        const token: string = jsonwebtoken.sign(payload, secret, options);
        return new ProcessResultSuccess(token);
    }catch(e){
        return new ProcessResultError(true, e.message);
    }
}

const decodeToken = (token: string, secret: Secret): ProcessResultType => {
    try{
        const payload: JwtPayload = jsonwebtoken.verify(token, secret) as JwtPayload;
        return new ProcessResultSuccess(payload);
    }catch(e){
        if(e instanceof TokenExpiredError){
            return new ProcessResultError(false, "Token expired");
        }

        if(e instanceof JsonWebTokenError){
            return new ProcessResultError(false, "Invalid token");    
        }

        return new ProcessResultError(true, e.message);
    }
}

export const generateVerificationToken = (payload: object): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.verificationExpirationTime as StringValue
    }

    return generateToken(payload, JWT_CONFIG.verificationSecret, options);
}

export const decodeVerificationToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.verificationSecret);
}

export const generateAccessToken = (payload: object): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.accessExpirationTime as StringValue
    }

    return generateToken(payload, JWT_CONFIG.accessSecret, options);
}

export const decodeAccessToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.accessSecret);
}

export const generateRefreshToken = (payload: object): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.refreshExpirationTime as StringValue
    }

    return generateToken(payload, JWT_CONFIG.refreshSecret, options);
}

export const decodeRefreshToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.refreshSecret);
}