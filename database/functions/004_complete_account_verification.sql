CREATE OR REPLACE FUNCTION complete_account_verification(
    p_token VARCHAR(255)
) RETURNS INTEGER AS $$
DECLARE
    v_error error_codes;
    v_verification verifications;
    v_user users;
BEGIN
    SELECT * INTO v_verification FROM verifications WHERE is_deleted = 0
    AND type = 'ACCOUNT'::verification_type 
    AND token = p_token;

    IF v_verification IS NULL THEN
        v_error := get_error('TOKEN_NOT_FOUND');
        RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
    END IF;

    IF v_verification.active_till < CURRENT_TIMESTAMP OR v_verification.is_completed THEN
        v_error := get_error('TOKEN_EXPIRED');
        RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
    END IF;

    SELECT * INTO v_user FROM users WHERE id = v_verification.user_id
    AND is_verified = FALSE 
    AND is_active = TRUE
    AND is_deleted = 0;

    IF v_user IS NULL THEN
        v_error := get_error('USER_NOT_FOUND');
        RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
    END IF;

    UPDATE verifications SET is_completed = TRUE WHERE id = v_verification.id;
    UPDATE users SET is_verified = TRUE WHERE id = v_user.id;

    RETURN v_verification.id;
END;
$$ LANGUAGE plpgsql;