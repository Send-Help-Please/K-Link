interface DBErrorCodeI {
    errorCode: string,
    errorMessage?: string,
    fieldKey?: string
}

const ERROR_CODES: DBErrorCodeI[] = [];

export default ERROR_CODES;