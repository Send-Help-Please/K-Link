CREATE TYPE verification_type AS ENUM('ACCOUNT', 'EMAIL', 'PASSWORD');


CREATE TABLE IF NOT EXISTS error_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL,
    "key" VARCHAR(30) NOT NULL,
    message VARCHAR(255) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX unique_error_codes_code ON error_codes (code, is_deleted);

INSERT INTO error_codes (code, "key", message) VALUES
('U0001', 'USERNAME_TAKEN', 'Username already taken'),
('U0002', 'EMAIL_TAKEN', 'Email already taken'),
('T0001', 'TOKEN_TAKEN', 'Token already taken'),
('T0002', 'TOKEN_NOT_FOUND', 'Token not found'),
('T0003', 'TOKEN_EXPIRED', 'Token expired'),
('U0003', 'USER_NOT_FOUND', 'User not found');


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
    active_till TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 minutes' NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_verifications_user_id ON verifications (user_id);

CREATE UNIQUE INDEX unique_verifications_token ON verifications (token, is_deleted); 


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


