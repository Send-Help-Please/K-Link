import { MassValidationErrorModelParamI, ResultModelParamI, ValidationErrorModelParamI } from "../interfaces/ModelInterfaces";
import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class ValidationSuccessModel extends ResultSuccessModel {
    constructor(params: ResultModelParamI) {
        super(params);
    }
}

export class ValidationErrorModel extends ResultErrorModel {
    public errorMessages?: string[];
    constructor(params: ValidationErrorModelParamI) {
        super({ critical: params.critical, message: params.message });
        this.errorMessages = params.errorMessages;
    }
};

export class MassValidationSuccessModel extends ValidationSuccessModel {}

export class MassValidationErrorModel extends ResultErrorModel {
    public errorMessages?: Record<string, string[]>;
    constructor(params: MassValidationErrorModelParamI){
        super({ critical: params.critical, message: params.message });
        this.errorMessages = params.errorMessages;
    }
}

export type ValidationType = ValidationSuccessModel | ValidationErrorModel;
export type MassValidationType = MassValidationSuccessModel | MassValidationErrorModel;