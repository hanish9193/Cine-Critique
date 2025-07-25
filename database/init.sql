-- CineReview Database Schema
-- PostgreSQL initialization script

-- Create database (run this first if creating a new database)
-- CREATE DATABASE cinereview;

-- Connect to the database
-- \c cinereview;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    genre VARCHAR NOT NULL,
    language VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    director VARCHAR,
    description TEXT,
    poster_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    movie_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    sentiment VARCHAR CHECK (sentiment IN ('positive', 'negative')),
    sentiment_confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(user_id, movie_id)
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    movie_id INTEGER NOT NULL,
    liked BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    UNIQUE(user_id, movie_id)
);

-- Insert sample Indian movies
INSERT INTO movies (title, genre, language, year, director, description, poster_url) VALUES
('RRR', 'Action, Drama, History', 'Telugu', 2022, 'S. S. Rajamouli', 'A fictional story of two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', '/images/rrr.jpg'),
('Baahubali', 'Action, Drama, Fantasy', 'Telugu', 2015, 'S. S. Rajamouli', 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring tribes.', '/images/baahubali.jpg'),
('Dangal', 'Biography, Drama, Sport', 'Hindi', 2016, 'Nitesh Tiwari', 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games.', '/images/dangal.jpg'),
('KGF Chapter 1', 'Action, Crime, Drama', 'Kannada', 2018, 'Prashanth Neel', 'In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope to legions of downtrodden people.', '/images/kgf.jpg'),
('Vikram', 'Action, Crime, Thriller', 'Tamil', 2022, 'Lokesh Kanagaraj', 'Members of a black ops team must track and eliminate a gang of masked murderers.', '/images/vikram.jpg'),
('Pushpa', 'Action, Crime, Drama', 'Telugu', 2021, 'Sukumar', 'A laborer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.', '/images/pushpa.jpg'),
('Sardar Udham', 'Biography, Crime, Drama', 'Hindi', 2021, 'Shoojit Sircar', 'A biopic detailing the life of Sardar Udham Singh, a Sikh revolutionary who assassinated Michael O''Dwyer in London.', '/images/sardar_udham.jpg'),
('Master', 'Action, Crime, Thriller', 'Tamil', 2021, 'Lokesh Kanagaraj', 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the school children for criminal activities.', '/images/master.jpg'),
('Shershaah', 'Action, Biography, Drama', 'Hindi', 2021, 'Vishnuvardhan', 'Based on the life of Captain Vikram Batra who was an officer of the Indian Army and recipient of the Param Vir Chakra.', '/images/shershaah.jpg'),
('Sooryavanshi', 'Action, Crime, Drama', 'Hindi', 2021, 'Rohit Shetty', 'DCP Veer Sooryavanshi, the chief of the Anti-Terrorism Squad in India, tries to bring down a terrorist organization.', '/images/sooryavanshi.jpg'),
('Bell Bottom', 'Action, Drama, Thriller', 'Hindi', 2021, 'Ranjit M Tewari', 'When flight hijacks were a common occurrence in the 80s, a RAW agent is sent to rescue the passengers of a hijacked Indian flight.', '/images/bell_bottom.jpg'),
('Adipurush', 'Action, Adventure, Drama', 'Hindi', 2023, 'Om Raut', 'Adaptation of Indian mythology that depicts the triumph of good over evil.', '/images/adipurush.jpg')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_movie_id ON user_preferences(movie_id);
CREATE INDEX IF NOT EXISTS idx_movies_language ON movies(language);
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();