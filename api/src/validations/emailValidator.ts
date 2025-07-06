import validator from "validator";

import * as ValidationModels from "../models/ValidationModels";
import { alreadyTaken, notString, notValid } from "../constants/errorGenerators";
import { EMAIL_VERBOSE } from "../constants/Parameters";
import generateValidator from "./validatorGenerator";
import { getUserByEmail } from "../services/usersService";

const validateEmail = async (email: unknown): Promise<ValidationModels.ValidationType> => {
    if(typeof email !== "string"){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notString(EMAIL_VERBOSE)] });
    }

    if(validator.isEmail(email) === false) {
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notValid(EMAIL_VERBOSE)] });
    }

    const getUserResult = await getUserByEmail(email);
    if(!getUserResult.success) return new ValidationModels.ValidationErrorModel({ critical: true });
    if(getUserResult.rowCount && getUserResult.rowCount > 0) return new ValidationModels.ValidationErrorModel({ errorMessages: [alreadyTaken(EMAIL_VERBOSE)] });

    return new ValidationModels.ValidationSuccessModel({ data: email });
}

export default generateValidator(EMAIL_VERBOSE, "string", true, [validateEmail]);