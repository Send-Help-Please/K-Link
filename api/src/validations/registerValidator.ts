import * as ValidationModels from "../models/ValidationModels";
import validateEmail from "./emailValidator";
import validatePassword from "./passwordValidator";
import validateUsername from "./usernameValidator";
import validatePasswordRepeat from "./passwordRepeatValidator";
import { USERNAME, EMAIL, PASSWORD, PASSWORD_REPEAT } from "../constants/Parameters";

const validateRegister = async (
    username: unknown,
    email: unknown,
    password: unknown,
    passwordRepeat: unknown
): Promise<ValidationModels.MassValidationType> => {
    let errors: Record<string, string[]> = {};
    let data: Record<string, unknown> = {};
    let result: ValidationModels.ValidationType;

    result = await validateUsername(username);
    if(!result.success){
        if(result.critical) return new ValidationModels.MassValidationErrorModel({ critical: true });
        else errors[USERNAME] = result.errorMessages || [];
    }
    
    data[USERNAME] = result.data;

    result = await validateEmail(email);
    if(!result.success){
        if(result.critical) return new ValidationModels.MassValidationErrorModel({ critical: true });
        else errors[EMAIL] = result.errorMessages || [];
    }

    data[EMAIL] = result.data;

    result = await validatePassword(password);
    if(!result.success){
        if(result.critical) return new ValidationModels.MassValidationErrorModel({ critical: true });
        else errors[PASSWORD] = result.errorMessages || [];
    }

    data[PASSWORD] = result.data;

    const validatedPassword = result.data;

    result = await validatePasswordRepeat(passwordRepeat, { password: validatedPassword });
    if(!result.success){
        if(result.critical) return new ValidationModels.MassValidationErrorModel({ critical: true });
        else errors[PASSWORD_REPEAT] = result.errorMessages || [];
    }

    data[PASSWORD_REPEAT] = result.data;

    if(Object.keys(errors).length > 0){
        return new ValidationModels.MassValidationErrorModel({ errorMessages: errors });
    }

    return new ValidationModels.MassValidationSuccessModel({ data: data });
}

export default validateRegister;