import * as ValidationModels from "../models/ValidationModels";
import validateEmail from "./emailValidator";
import validatePassword from "./passwordValidator";
import validateUsername from "./usernameValidator";
import { USERNAME, EMAIL, PASSWORD } from "../constants/Parameters";
import validateMass from "./massValidator";

const validateRegister = async (
    username: unknown,
    email: unknown,
    password: unknown
): Promise<ValidationModels.MassValidationType> => {
    return await validateMass([
        { key: USERNAME, value: username, func: validateUsername },
        { key: EMAIL, value: email, func: validateEmail },
        { key: PASSWORD, value: password, func: validatePassword },
    ]);
}

export default validateRegister;