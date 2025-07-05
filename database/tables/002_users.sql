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