export const notString = (key: string) => `${key} must be a string`;
export const notAscii = (key: string) => `${key} must be ASCII`;
export const notValid = (key: string) => `${key} must be valid`;
export const notProvided = (key: string) => `${key} must be provided`;
export const hasSpace = (key: string) => `${key} must not have spaces`;

export const notCorrectLength = (key: string, min?: number, max?: number) => {
    if(min || max){
        if(min && max){
            return `${key} must be between ${min} and ${max} characters`;
        } else if(min){
            return `${key} must be at least ${min} characters`;
        } else if(max){
            return `${key} must be at most ${max} characters`;
        }
    }

    return "";
}