DROP FUNCTION IF EXISTS create_user;
CREATE OR REPLACE FUNCTION create_user(
    p_username VARCHAR(20),
    p_email VARCHAR(320),
    p_password VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    v_user RECORD;
    v_user_id INTEGER;
    v_error error_codes;
BEGIN
    SELECT u.username, u.email INTO v_user
    FROM users u
    WHERE (u.username = p_username OR u.email = p_email)
    AND u.is_deleted = 0;

    IF v_user IS NOT NULL THEN
        IF v_user.username = p_username THEN
            v_error := get_error('USERNAME_TAKEN');
            RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
        END IF;

        IF v_user.email = p_email THEN
            v_error := get_error('EMAIL_TAKEN');
            RAISE EXCEPTION USING MESSAGE = v_error.message, ERRCODE = v_error.code;
        END IF;
    END IF;

    INSERT INTO users (username, email, password)
    VALUES (p_username, p_email, p_password)
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;