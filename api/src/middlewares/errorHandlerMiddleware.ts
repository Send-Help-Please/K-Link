import { Request, Response, NextFunction } from "express";
import { STATUS_BAD_REQUEST } from "../constants/StatusCodes";
import { generateResponseBadRequest, generateResponseInternalServerError } from "../utils/responseGenerator";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    if (
        err instanceof SyntaxError &&
        'statusCode' in err &&
        (err as any).statusCode === STATUS_BAD_REQUEST &&
        'body' in err
    ) {
        generateResponseBadRequest(res, "Invalid JSON");
        return;
    }

    generateResponseInternalServerError(res);
    return;
};

export default errorHandler;