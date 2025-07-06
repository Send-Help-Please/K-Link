CREATE OR REPLACE FUNCTION complete_verification(
    p_token VARCHAR(255),
    p_type verification_type
) RETURNS INTEGER AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    IF p_type = 'ACCOUNT'::verification_type THEN
        RETURN complete_account_verification(p_token);
    -- ELSIF p_type = 'EMAIL'::verification_type THEN
    --     RETURN complete_email_verification(p_token);
    -- ELSIF p_type = 'PASSWORD'::verification_type THEN
    --     RETURN complete_password_verification(p_token);
    ELSE
        RAISE EXCEPTION 'Invalid verification type: %', p_type;
    END IF;
END;
$$ LANGUAGE plpgsql;