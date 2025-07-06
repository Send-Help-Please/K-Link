export interface ResultModelParamI {
    data?: any,
    message?: string
}

export interface ResultErrorParamI {
    critical?: boolean,
    message?: string
}

export interface ResponseModelParamI extends ResultModelParamI {
    statusCode: number
}

export interface ResponseErrorModelParamI extends ResultErrorParamI {
    statusCode: number,
    validationErrors?: Record<string, string[]>
}

export interface ValidationErrorModelParamI extends ResultErrorParamI {
    errorMessages?: string[]
}

export interface MassValidationErrorModelParamI extends ResultErrorParamI {
    errorMessages?: Record<string, string[]>
}

export interface DBResultModelParamI extends ResultModelParamI {
    rowCount?: number
}

export interface DBResultErrorModelParamI extends ResultErrorParamI {
    errorCode?: string
    fieldKey?: string
}