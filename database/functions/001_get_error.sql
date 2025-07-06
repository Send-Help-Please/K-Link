DROP FUNCTION IF EXISTS get_error;
CREATE OR REPLACE FUNCTION get_error(
    p_error_key text
) RETURNS error_codes AS $$
DECLARE
    v_error error_codes;
BEGIN
    SELECT * INTO v_error
    FROM error_codes ec
    WHERE ec."key" = p_error_key
    AND ec.is_deleted = 0
    LIMIT 1;

    IF v_error IS NULL THEN
        RAISE EXCEPTION 'Error with key %s does not exist or is deleted', p_error_key;
    END IF;

    RETURN v_error;
END;
$$ LANGUAGE plpgsql;