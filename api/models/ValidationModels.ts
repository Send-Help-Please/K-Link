import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class ValidationSuccessModel extends ResultSuccessModel {
    constructor(data: any) {
        super(data);
    }
}

export class ValidationErrorModel extends ResultErrorModel {
    public errorMessages?: string[];
    constructor(errorMessages?: string[], critical: boolean = false) {
        super(critical);
        this.errorMessages = errorMessages;
    }
};

export class MassValidationSuccessModel extends ValidationSuccessModel {}

export class MassValidationErrorModel extends ResultErrorModel {
    public errorMessages?: Record<string, string[]>;
    constructor(errorMessages?: Record<string, string[]>, critical: boolean = false){
        super(critical);
        this.errorMessages = errorMessages;
    }
}

export type ValidationType = ValidationSuccessModel | ValidationErrorModel;
export type MassValidationType = MassValidationSuccessModel | MassValidationErrorModel;