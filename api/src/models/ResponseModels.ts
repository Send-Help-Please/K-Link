import { ResponseErrorModelParamI, ResponseModelParamI } from "../interfaces/ModelInterfaces";
import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class ResponseSuccessModel extends ResultSuccessModel {
    public statusCode: number;
    constructor(params: ResponseModelParamI) {
        super({ data: params.data, message: params.message });
        this.statusCode = params.statusCode;
    }
}

export class ResponseErrorModel extends ResultErrorModel {
    public statusCode: number;
    public validationErrors?: Record<string, string[]>;
    constructor(params: ResponseErrorModelParamI) {
        super({ critical: params.critical, message: params.message });
        this.statusCode = params.statusCode
        this.validationErrors = params.validationErrors;
    }
}

export type ResponseType = ResponseSuccessModel | ResponseErrorModel;