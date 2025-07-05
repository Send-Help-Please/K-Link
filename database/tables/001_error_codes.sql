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