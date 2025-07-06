import jsonwebtoken, { JwtPayload, Secret, TokenExpiredError, JsonWebTokenError, SignOptions } from "jsonwebtoken"; 
import { ProcessResultError, ProcessResultSuccess, ProcessResultType } from "../models/ProcessResultModels";
import JWT_CONFIG from "../configs/JWTConfig";

type StringValue = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;

const generateToken = (payload: { [key: string]: unknown }, secret: Secret, options?: SignOptions): ProcessResultType => {
    try{
        payload["uid"] = Date.now();
        const token: string = jsonwebtoken.sign(payload, secret, options);
        return new ProcessResultSuccess({ data: token });
    } catch (e) {
        return new ProcessResultError({ critical: true, message: e instanceof Error ? e.message : undefined });
    }
}

const decodeToken = (token: string, secret: Secret): ProcessResultType => {
    try{
        const payload: JwtPayload = jsonwebtoken.verify(token, secret) as JwtPayload;
        return new ProcessResultSuccess({ data: payload });
    }catch(e){
        if(e instanceof TokenExpiredError){
            return new ProcessResultError({ message: "Token expired" });
        }

        if(e instanceof JsonWebTokenError){
            return new ProcessResultError({ message: "Invalid token" });    
        }

        return new ProcessResultError({ critical: true, message: e instanceof Error ? e.message : undefined });
    }
}

export const generateVerificationToken = (payload: { [key: string]: unknown }): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.JWT_VERIFICATION_EXPIRATION_TIME as StringValue
    }

    return generateToken(payload, JWT_CONFIG.JWT_VERIFICATION_SECRET, options);
}

export const decodeVerificationToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.JWT_VERIFICATION_SECRET);
}

export const generateAccessToken = (payload: { [key: string]: unknown }): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.JWT_ACCESS_EXPIRATION_TIME as StringValue
    }

    return generateToken(payload, JWT_CONFIG.JWT_ACCESS_SECRET, options);
}

export const decodeAccessToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.JWT_ACCESS_SECRET);
}

export const generateRefreshToken = (payload: { [key: string]: unknown }): ProcessResultType => {
    const options: SignOptions = {
        expiresIn: JWT_CONFIG.JWT_REFRESH_EXPIRATION_TIME as StringValue
    }

    return generateToken(payload, JWT_CONFIG.JWT_REFRESH_SECRET, options);
}

export const decodeRefreshToken = (token: string): ProcessResultType => {
    return decodeToken(token, JWT_CONFIG.JWT_REFRESH_SECRET);
}