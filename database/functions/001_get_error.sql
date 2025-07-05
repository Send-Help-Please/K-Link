CREATE OR REPLACE FUNCTION get_error(
    p_error_key VARCHAR(40)
) RETURNS TABLE(
    code VARCHAR(5),
    message VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT ec.code, ec.message
    FROM error_codes ec
    WHERE ec.key = p_error_key
    AND ec.is_deleted = 0;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Error with key % does not exist or is deleted', p_error_key;
    END IF;
END;
$$ LANGUAGE plpgsql;