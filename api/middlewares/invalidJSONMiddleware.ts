import { Request, Response, NextFunction } from "express";
import { STATUS_BAD_REQUEST } from "../constants/StatusCodes";
import { generateResponseBadRequest } from "../utils/responseGenerators";

const invalidJsonHandler = (err: any, _: Request, res: Response, next: NextFunction): any => {
    if(err instanceof SyntaxError && err["statusCode"] && err["statusCode"] === STATUS_BAD_REQUEST && 'body' in err){
        generateResponseBadRequest(res, "Invalid JSON");
        return;
    }

    next(err);
}

export default invalidJsonHandler;