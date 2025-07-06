import { ResultErrorParamI, ResultModelParamI } from "../interfaces/ModelInterfaces";

class ResultModel {
    public data?: any;
    public message?: string;

    constructor(params: ResultModelParamI) {
        this.data = params.data;
        this.message = params.message;
    }
}

export class ResultSuccessModel extends ResultModel {
    public success: true = true;
}

export class ResultErrorModel extends ResultModel {
    public success: false = false;
    public critical: boolean = false;
    constructor(params: Partial<ResultErrorParamI>) {
        super({ message: params.message });
        this.critical = params.critical !== undefined ? params.critical : this.critical;
    }
}