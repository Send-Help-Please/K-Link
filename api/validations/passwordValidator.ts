import validator from "validator";

import * as ValidationModels from "../models/ValidationModels";
import { notAscii, notCorrectLength, notString } from "../constants/errorGenerators";
import { PASSWORD_VERBOSE } from "../constants/Parameters";
import { PASSWORD_NO_LOWERCASE, PASSWORD_NO_NUMBER, PASSWORD_NO_SPECIAL_CHARACTER, PASSWORD_NO_UPPERCASE } from "../constants/PasswordErrors";
import generateValidator from "./validatorGenerator";

const validatePassword = async (password: unknown): Promise<ValidationModels.ValidationType> => {
    if(typeof password !== "string"){
        return new ValidationModels.ValidationErrorModel([notString(PASSWORD_VERBOSE)]);
    }

    if(validator.isAscii(password) === false){
        return new ValidationModels.ValidationErrorModel([notAscii(PASSWORD_VERBOSE)]);
    }

    let errors: string[] = [];

    if(validator.isLength(password, { min: 8 }) === false){
        errors.push(notCorrectLength(PASSWORD_VERBOSE, 8));
    }

    if(/[a-z]/.test(password) === false){
        errors.push(PASSWORD_NO_LOWERCASE);
    }

    if(/[A-Z]/.test(password) === false){
        errors.push(PASSWORD_NO_UPPERCASE);
    }

    if(/[0-9]/.test(password) === false){
        errors.push(PASSWORD_NO_NUMBER);
    }

    if(/[^a-zA-Z0-9]/.test(password) === false){
        errors.push(PASSWORD_NO_SPECIAL_CHARACTER);
    }

    if(errors.length > 0){
        return new ValidationModels.ValidationErrorModel(errors);
    }

    return new ValidationModels.ValidationSuccessModel(password);
}

export default generateValidator<string>(PASSWORD_VERBOSE, "string", true, [validatePassword]);