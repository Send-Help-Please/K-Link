import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class ResponseSuccessModel extends ResultSuccessModel {
    public statusCode: number;
    constructor(statusCode: number, data?: any, message?: string) {
        super(data, message);
        this.statusCode = statusCode
    }
}

export class ResponseErrorModel extends ResultErrorModel {
    public statusCode: number;
    public validationErrors?: Record<string, string[]>;
    constructor(statusCode: number, message?: string, validationErrors?: Record<string, string[]>, critical: boolean = false) {
        super(critical, message);
        this.statusCode = statusCode
        this.validationErrors = validationErrors;
    }
}

export type ResponseType = ResponseSuccessModel | ResponseErrorModel;