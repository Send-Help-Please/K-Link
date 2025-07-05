import { ResultSuccessModel, ResultErrorModel } from "./ResultModels";

export class ProcessResultSuccess extends ResultSuccessModel {}
export class ProcessResultError extends ResultErrorModel {}

export type ProcessResultType = ProcessResultSuccess | ProcessResultError;