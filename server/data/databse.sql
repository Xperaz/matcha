-- Enum Types (unchanged)
CREATE TYPE user_status AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE gender_enum AS ENUM ('MALE', 'FEMALE', 'NON_BINARY');
CREATE TYPE preferences_enum AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'ALL');
CREATE TYPE like_status AS ENUM ('PENDING', 'MATCHED', 'REJECTED');

-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    biography VARCHAR(500),
    gps_position POINT,
    fame_rating INT NOT NULL DEFAULT 0 CHECK (fame_rating >= 0 AND fame_rating <= 100),
    sexual_preferences preferences_enum NOT NULL,
    age INT NOT NULL CHECK (age >= 18 AND age <= 120),
    last_connection TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gender gender_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT,
    receiver_id BIGINT,
    content TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    tag VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
);


CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    initiator_id BIGINT,
    receiver_id BIGINT,
    status like_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE SET NULL,
);


CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reason TEXT NOT NULL,
    reported_id BIGINT,
    reporter_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
);



CREATE TABLE blocks (
    id BIGSERIAL PRIMARY KEY,
    blocked_id BIGINT,
    blocker_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE SET NULL,
);


CREATE TABLE visits (
    id BIGSERIAL PRIMARY KEY,
    visitor_id BIGINT,
    visited_id BIGINT,
    visit_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (visited_id) REFERENCES users(id) ON DELETE SET NULL,
);

CREATE TABLE pictures (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    picture_url VARCHAR(255) NOT NULL,
    is_profile_picture BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_likes_initiator_receiver ON likes(initiator_id, receiver_id);
CREATE INDEX idx_user_tags_user ON user_tags(user_id);
CREATE INDEX idx_visits_visitor_visited ON visits(visitor_id, visited_id);
CREATE INDEX idx_pictures_user ON pictures(user_id);