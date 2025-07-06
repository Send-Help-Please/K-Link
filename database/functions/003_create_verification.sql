CREATE OR REPLACE FUNCTION create_verification(
    p_user_id INTEGER,
    p_token VARCHAR(255),
    p_type verification_type
) RETURNS INTEGER AS $$
DECLARE
    v_verification_id INTEGER;
    v_verification RECORD;
    v_error RECORD;
BEGIN
    SELECT * INTO v_verification FROM verifications WHERE token = p_token AND is_deleted = 0 LIMIT 1;
    IF v_verification IS NOT NULL THEN
        v_error := get_error('TOKEN_TAKEN');
        RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
    END IF;

    INSERT INTO verifications (user_id, token, type) VALUES (p_user_id, p_token, p_type) RETURNING id INTO v_verification_id;
    RETURN v_verification_id;
END;
$$ LANGUAGE plpgsql;