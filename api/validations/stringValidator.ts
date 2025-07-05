import * as ValidationModels from "../models/ValidationModels";
import { notString } from "../constants/errorGenerators";

const validateString = (key: string, value: unknown): ValidationModels.ValidationType => {
    return typeof value === "string" ? 
    new ValidationModels.ValidationSuccessModel(value) :
    new ValidationModels.ValidationErrorModel([notString(key)]);
}

export default validateString;