import * as ValidationModels from "../models/ValidationModels";

export interface MassValidationI {
    key: string,
    value: unknown,
    func: (value: unknown) => Promise<ValidationModels.ValidationType>
}

const validateMass = async (obj: MassValidationI[]): Promise<ValidationModels.MassValidationType> => {
    let errors: Record<string, string[]> = {};
    let data: Record<string, unknown> = {};
    let result: Record<string, unknown> = {};

    for(const validation of obj){
        result[validation.key] = await validation.func(validation.value);
    }

    for(const [key, value] of Object.entries(result)){
        if(value instanceof ValidationModels.ValidationErrorModel){
            if(value.critical){
                return new ValidationModels.MassValidationErrorModel(undefined, true);
            }

            errors[key] = value.errorMessages || [];
        }else if(value instanceof ValidationModels.ValidationSuccessModel){
            data[key] = value.data;
        }
    }

    if(Object.keys(errors).length > 0){
        return new ValidationModels.MassValidationErrorModel(errors);
    }

    return new ValidationModels.MassValidationSuccessModel(data);
}

export default validateMass;