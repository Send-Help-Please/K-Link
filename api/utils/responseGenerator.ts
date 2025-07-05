import { Response } from "express";

import { ResponseType, ResponseSuccessModel, ResponseErrorModel } from "../models/ResponseModels";
import * as StatusCodes from "../constants/StatusCodes";

const generateResponse = (res: Response, resObject: ResponseType) => {
    res.status(resObject.statusCode).json(resObject);
}

export const generateResponseOK = (res: Response, message?: string, data?: any) => {
    const resObject: ResponseType = new ResponseSuccessModel(StatusCodes.STATUS_OK, data, message);
    generateResponse(res, resObject);
}

export const generateResponseAccepted = (res: Response, message?: string, data?: any) => {
    const resObject: ResponseSuccessModel = new ResponseSuccessModel(StatusCodes.STATUS_ACCEPTED, data, message);
    generateResponse(res, resObject);
}

export const generateResponseCreated = (res: Response, message?: string, data?: any) => {
    const resObject: ResponseSuccessModel = new ResponseSuccessModel(StatusCodes.STATUS_CREATED, data, message);
    generateResponse(res, resObject);
}

export const generateResponseOKNoContent = (res: Response, message?: string, data?: any) => {
    const resObject: ResponseSuccessModel = new ResponseSuccessModel(StatusCodes.STATUS_OK_NO_CONTENT, data, message);
    generateResponse(res, resObject);
}

export const generateResponseBadRequest = (res: Response, errorMessage?: string, validationErrors?: Record<string, string[]>) => {
    const resObject: ResponseErrorModel = new ResponseErrorModel(StatusCodes.STATUS_BAD_REQUEST, errorMessage, validationErrors);
    generateResponse(res, resObject);
}

export const generateResponseUnauthorized = (res: Response, errorMessage?: string) => {
    const resObject: ResponseErrorModel = new ResponseErrorModel(StatusCodes.STATUS_UNAUTHORIZED, errorMessage);
    generateResponse(res, resObject);
}

export const generateResponseForbidden = (res: Response, errorMessage?: string) => {
    const resObject: ResponseErrorModel = new ResponseErrorModel(StatusCodes.STATUS_FORBIDDEN, errorMessage);
    generateResponse(res, resObject);
}

export const generateResponseNotFound = (res: Response, errorMessage?: string) => {
    const resObject: ResponseErrorModel = new ResponseErrorModel(StatusCodes.STATUS_NOT_FOUND, errorMessage);
    generateResponse(res, resObject);
}

export const generateResponseInternalServerError = (res: Response) => {
    const resObject: ResponseErrorModel = new ResponseErrorModel(StatusCodes.STATUS_INTERNAL_SERVER_ERROR);
    generateResponse(res, resObject);
}