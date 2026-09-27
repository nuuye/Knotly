CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    platform_role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    bio VARCHAR(620),
    status VARCHAR(30),
    username VARCHAR(40) NOT NULL,
    username_normalized VARCHAR(40) NOT NULL,
    avatar_url VARCHAR(350),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_username_normalized UNIQUE (username_normalized)
);
