import { ResultErrorModel, ResultSuccessModel } from "./ResultModels";

export class DBResultSuccessModel extends ResultSuccessModel {
    public rowCount?: number;
    constructor(rows?: any, rowCount?: number, message?: string) {
        super(rows, message);
        this.rowCount = rowCount
    }
}

export class DBResultErrorModel extends ResultErrorModel {
    public errorCode?: string;
    public fieldKey?: string;
    constructor(errorCode?: string, fieldKey?: string, message?: string, critical: boolean = false) {
        super(critical, message);
        this.errorCode = errorCode;
        this.fieldKey = fieldKey
    }
}

export type DBResultType = DBResultSuccessModel | DBResultErrorModel;