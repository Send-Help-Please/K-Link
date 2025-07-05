import validator from "validator";

import * as ValidationModels from "../models/ValidationModels";
import { hasSpace, notAscii, notCorrectLength } from "../constants/errorGenerators";
import { USERNAME, USERNAME_VERBOSE } from "../constants/Parameters";
import generateValidator from "./validatorGenerator";

const validateUsername = async (username: string): Promise<ValidationModels.ValidationType> => {
    if(validator.isAscii(username) === false){
        return new ValidationModels.ValidationErrorModel([notAscii(USERNAME_VERBOSE)]);
    }

    if(validator.isLength(username, { min: 5, max: 20 }) === false){
        return new ValidationModels.ValidationErrorModel([notCorrectLength(USERNAME_VERBOSE, 5, 20)]);
    }

    if(username.includes(" ")){
        return new ValidationModels.ValidationErrorModel([hasSpace(USERNAME_VERBOSE)]);
    }

    return new ValidationModels.ValidationSuccessModel(username);
}

export default generateValidator<string>(USERNAME_VERBOSE, "string", true, [validateUsername]);