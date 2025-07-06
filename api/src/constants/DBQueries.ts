export const CREATE_USER = "SELECT * FROM create_user($1, $2, $3) AS id";
export const CREATE_VERIFICATION = "SELECT * FROM create_verification($1, $2, $3) AS id";
export const GET_ERROR_CODES = "SELECT * FROM error_codes";

export const GET_USER_BY_USERNAME = "SELECT * FROM users WHERE username = $1 AND is_deleted = 0;";
export const GET_USER_BY_EMAIL = "SELECT * FROM users WHERE email = $1 AND is_deleted = 0;";