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