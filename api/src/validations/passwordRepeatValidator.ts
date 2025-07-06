import * as ValidationModels from "../models/ValidationModels";
import { PASSWORD_VERBOSE } from "../constants/Parameters";
import { PASSWORD_NO_MATCH } from "../constants/PasswordErrors";
import generateValidator from "./validatorGenerator";

const validatePasswordRepeat = async (passwordRepeat: unknown, context: { password: string }): Promise<ValidationModels.ValidationType> => {
    if(passwordRepeat && context.password !== passwordRepeat){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [PASSWORD_NO_MATCH]});
    }

    return new ValidationModels.ValidationSuccessModel({ data: passwordRepeat });
}

export default generateValidator<string>(PASSWORD_VERBOSE, "string", true, [validatePasswordRepeat]);