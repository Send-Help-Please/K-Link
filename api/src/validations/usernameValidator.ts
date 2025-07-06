import validator from "validator";

import * as ValidationModels from "../models/ValidationModels";
import { alreadyTaken, hasSpace, notAscii, notCorrectLength } from "../constants/errorGenerators";
import { USERNAME_VERBOSE } from "../constants/Parameters";
import generateValidator from "./validatorGenerator";
import { getUserByUsername } from "../services/usersService";

const validateUsername = async (username: string): Promise<ValidationModels.ValidationType> => {
    if(validator.isAscii(username) === false){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notAscii(USERNAME_VERBOSE)] });
    }

    if(validator.isLength(username, { min: 5, max: 20 }) === false){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notCorrectLength(USERNAME_VERBOSE, 5, 20)] });
    }

    if(username.includes(" ")){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [hasSpace(USERNAME_VERBOSE)] });
    }

    const getUserResult = await getUserByUsername(username);
    
    if(!getUserResult.success) return new ValidationModels.ValidationErrorModel({ critical: true });
    if(getUserResult.rowCount && getUserResult.rowCount > 0) return new ValidationModels.ValidationErrorModel({ errorMessages: [alreadyTaken(USERNAME_VERBOSE)] });

    return new ValidationModels.ValidationSuccessModel({ data: username });
}

export default generateValidator<string>(USERNAME_VERBOSE, "string", true, [validateUsername]);