class ResultModel {
    public data?: any;
    public message?: string;

    constructor(data?: any, message?: string) {
        this.data = data;
        this.message = message;
    }
}

export class ResultSuccessModel extends ResultModel {
    public success: true = true;
    constructor(data?: any, message?: string) {
        super(data, message);
    }
}

export class ResultErrorModel extends ResultModel {
    public success: false = false;
    public critical: boolean = false;
    constructor(critical: boolean = false, message?: string) {
        super(undefined, message);
        this.critical = critical;
    }
}