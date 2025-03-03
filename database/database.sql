-- Enum Types (unchanged)
CREATE TYPE user_status AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE preferences_enum AS ENUM ('MALE', 'FEMALE', 'BOTH');
CREATE TYPE like_status AS ENUM ('LIKED', 'MATCH', 'DISLIKED');

-- Users Table
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(70) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    biography VARCHAR(500),
    profile_picture VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    city VARCHAR(50),
    country VARCHAR(50),
    fame_rating INT  DEFAULT 1,
    sexual_preferences preferences_enum,
    age INT NOT NULL,
    last_connection TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gender gender_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    profile_completed BOOLEAN DEFAULT FALSE,
    is_google BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id uuid,
    receiver_id uuid,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE interest_tags (
    id BIGSERIAL PRIMARY KEY,
    tag VARCHAR(20) UNIQUE NOT NULL
);

-- User Interests Junction Table
CREATE TABLE interests (
    user_id UUID,
    interest_id BIGINT,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (interest_id) REFERENCES interest_tags(id)
);


CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    initiator_id uuid,
    receiver_id uuid,
    status like_status,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_like UNIQUE (initiator_id, receiver_id),
    FOREIGN KEY (initiator_id) REFERENCES users(id) ,
    FOREIGN KEY (receiver_id) REFERENCES users(id) 
);


CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reported_id uuid,
    reporter_id uuid,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_id) REFERENCES users(id) ,
    FOREIGN KEY (reporter_id) REFERENCES users(id) 
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id uuid,
    receiver_id uuid,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ,
    FOREIGN KEY (receiver_id) REFERENCES users(id) 
);



CREATE TABLE blocks (
    id BIGSERIAL PRIMARY KEY,
    blocked_id uuid,
    blocker_id uuid,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ,
    FOREIGN KEY (blocker_id) REFERENCES users(id) 
);


CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,
    visitor_id uuid,
    visited_id uuid,
    visit_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES users(id) ,
    FOREIGN KEY (visited_id) REFERENCES users(id) 
);

CREATE TABLE pictures (
    id BIGSERIAL PRIMARY KEY,
    user_id uuid,
    picture_url VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id uuid,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_expiration TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);

CREATE TABLE email_verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id uuid,
    token VARCHAR(255) NOT NULL UNIQUE,
    token_expiration TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);


CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_likes_initiator_receiver ON likes(initiator_id, receiver_id);
CREATE INDEX idx_user_interests_user ON interests(user_id);
CREATE INDEX idx_visits_visitor_visited ON visits(visitor_id, visited_id);
CREATE INDEX idx_pictures_user ON pictures(user_id);

INSERT INTO interest_tags (tag) VALUES 
    ('TRAVEL'),
    ('MUSIC'),
    ('GYM'),
    ('SHOPPING'),
    ('PROGRAMMING'),
    ('FILMS'),
    ('NIGHTLIFE'),
    ('FOOTBALL'),
    ('FOOD'),
    ('DOGS'),
    ('CATS'),
    ('BOOKS'),
    ('GAMING')
;

