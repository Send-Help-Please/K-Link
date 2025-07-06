import * as ValidationModels from "../models/ValidationModels";
import validateRequired from "./requiredValidator";
import validateString from "./stringValidator";

type ValueType = "string" | "number" | "boolean";

const generateValidator = <T>(
    key: string, 
    type: ValueType, 
    required: boolean = true, 
    validationFunctions?: ((value: T, context?: any) => Promise<ValidationModels.ValidationType>)[]
): (value: unknown, context?: any) => Promise<ValidationModels.ValidationType> => {
    return async (value: unknown, context?: any): Promise<ValidationModels.ValidationType> => {
        const requiredValidation = validateRequired(key, value);
        if (!required && !requiredValidation.success) {
            return new ValidationModels.ValidationSuccessModel({});
        }
  
        if (required && !requiredValidation.success) {
            return requiredValidation;
        }
  
        value = requiredValidation.data;
  
        let typeValidation: ValidationModels.ValidationType;
        switch (type) {
            case "string":
                typeValidation = validateString(key, value);
                break;
            default:
                typeValidation = validateString(key, value);
        }
  
        if (!typeValidation.success) {
            return typeValidation;
        }
  
        let typedValue = typeValidation.data as T;
  
        if (validationFunctions) {
            for (const func of validationFunctions) {
                const funcValidation = await func(typedValue, context);
                if (!funcValidation.success) {
                    return funcValidation;
                }
  
                typedValue = funcValidation.data;
            }
        }
  
        return new ValidationModels.ValidationSuccessModel({ data: typedValue });
    };
};  

export default generateValidator;