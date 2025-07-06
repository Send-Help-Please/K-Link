import { PASSWORD_VERBOSE } from "../constants/Parameters";

export const PASSWORD_NO_LOWERCASE = `${PASSWORD_VERBOSE} must contain at least one lowercase letter`;
export const PASSWORD_NO_UPPERCASE = `${PASSWORD_VERBOSE} must contain at least one uppercase letter`;
export const PASSWORD_NO_NUMBER = `${PASSWORD_VERBOSE} must contain at least one number`;
export const PASSWORD_NO_SPECIAL_CHARACTER = `${PASSWORD_VERBOSE} must contain at least one special character`;
export const PASSWORD_NO_MATCH = `${PASSWORD_VERBOSE}s do not match`;