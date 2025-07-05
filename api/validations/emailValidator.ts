import validator from "validator";

import * as ValidationModels from "../models/ValidationModels";
import { notAscii, notString, notValid } from "../constants/errorGenerators";
import { EMAIL_VERBOSE } from "../constants/Parameters";
import generateValidator from "./validatorGenerator";

const validateEmail = async (email: unknown): Promise<ValidationModels.ValidationType> => {
    if(typeof email !== "string"){
        return new ValidationModels.ValidationErrorModel([notString(EMAIL_VERBOSE)]);
    }

    if(validator.isEmail(email) === false) {
        return new ValidationModels.ValidationErrorModel([notValid(EMAIL_VERBOSE)]);
    }

    return new ValidationModels.ValidationSuccessModel(email);
}

export default generateValidator(EMAIL_VERBOSE, "string", true, [validateEmail]);