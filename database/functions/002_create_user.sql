CREATE OR REPLACE FUNCTION create_user(
    p_username VARCHAR(20),
    p_email VARCHAR(320),
    p_password VARCHAR
) RETURNS INTEGER AS $$
DECLARE
    v_user RECORD;
    v_user_id INTEGER;
    v_error RECORD;
BEGIN
    SELECT * INTO v_user FROM users WHERE (username = p_username OR email = p_email) AND is_deleted = 0 LIMIT 1;
    IF v_user IS NOT NULL THEN
        IF v_user.username = p_username THEN
            SELECT * INTO v_error FROM get_error('USERNAME_TAKEN');
            RAISE EXCEPTION v_error.message USING ERRCODE = v_error.code;
        END IF;

        IF v_user.email = p_email THEN
            SELECT * INTO v_error FROM get_error('EMAIL_TAKEN');
            RAISE EXCEPTION v_error.message USING ERRCODE = v_error.code;
        END IF;
    END IF;

    INSERT INTO users (username, email, password) VALUES (p_username, p_email, p_password) RETURNING id INTO v_user_id;
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;