import * as ValidationModels from "../models/ValidationModels";
import { notProvided } from "../constants/errorGenerators";

const validateRequired = (key: string, value: unknown): ValidationModels.ValidationType => {
    if(typeof value === "string"){
        value = value.trim();
    }
    
    if(value === null || value === undefined || value === "") {
        return new ValidationModels.ValidationErrorModel([notProvided(key)]);
    }

    return new ValidationModels.ValidationSuccessModel(value);
}

export default validateRequired;