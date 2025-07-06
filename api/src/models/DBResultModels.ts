import { DBResultModelParamI, DBResultErrorModelParamI } from "../interfaces/ModelInterfaces";
import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class DBResultSuccessModel extends ResultSuccessModel {
    public rowCount?: number;
    constructor(params: DBResultModelParamI) {
        super({ data: params.data, message: params.message });
        this.rowCount = params.rowCount;
    }
}

export class DBResultErrorModel extends ResultErrorModel {
    public errorCode?: string;
    public fieldKey?: string;
    constructor(params: DBResultErrorModelParamI) {
        super({ critical: params.critical, message: params.message });
        this.errorCode = params.errorCode;
        this.fieldKey = params.fieldKey;
    }
}

export type DBResultType = DBResultSuccessModel | DBResultErrorModel;