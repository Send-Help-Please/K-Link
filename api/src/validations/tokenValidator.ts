import { TOKEN_VERBOSE } from "../constants/Parameters";
import validator from "validator";
import * as ValidationModels from "../models/ValidationModels";
import { notAscii, notCorrectLength, hasSpace } from "../constants/errorGenerators";

const validateToken = async (token: unknown): Promise<ValidationModels.ValidationType> => {
    if(validator.isAscii(token as string) === false){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notAscii(TOKEN_VERBOSE)]});
    }

    if(validator.isLength(token as string, { min: 150, max: 255 }) === false){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [notCorrectLength(TOKEN_VERBOSE, 5, 20)] });
    }

    if((token as string).includes(" ")){
        return new ValidationModels.ValidationErrorModel({ errorMessages: [hasSpace(TOKEN_VERBOSE)]});
    }

    return new ValidationModels.ValidationSuccessModel({ data: token });
}

export default validateToken;