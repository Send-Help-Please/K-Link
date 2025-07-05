CREATE TYPE verification_type AS ENUM('ACCOUNT', 'EMAIL', 'PASSWORD');


CREATE TABLE IF NOT EXISTS error_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL,
    key VARCHAR(30) NOT NULL,
    message VARCHAR(255) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX unique_error_codes_code ON error_codes (code, is_deleted);

INSERT INTO error_codes(code, key, message) VALUES (
    ("U0001", "USERNAME_TAKEN", "Username already taken"),
    ("U0002", "EMAIL_TAKEN", "Email already taken"),
    ("T0001", "TOKEN_TAKEN", "Token already taken")
);


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(320) NOT NULL,
    password VARCHAR NOT NULL,

    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX unique_users_username ON users (username, is_deleted);
CREATE UNIQUE INDEX unique_users_email ON users (email, is_deleted);

CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_email ON users (email);


CREATE TABLE IF NOT EXISTS verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    foreign key(user_id) references users(id),
    token VARCHAR(255) NOT NULL,
    type verification_type NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_verifications_user_id ON verifications (user_id);

CREATE UNIQUE INDEX unique_verifications_token ON verifications (token, is_deleted);


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
        SELECT * INTO v_error FROM get_error('TOKEN_TAKEN');
        RAISE EXCEPTION v_error.message USING ERRCODE = v_error.code;
    END IF;

    INSERT INTO verifications (user_id, token, type) VALUES (p_user_id, p_token, p_type) RETURNING id INTO v_verification_id;
    RETURN v_verification_id;
END;
$$ LANGUAGE plpgsql;


