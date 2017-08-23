Use noteable_test;

START TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE,
  password VARCHAR(1000),
  username VARCHAR(30) UNIQUE,
  facebook_id VARCHAR(100) UNIQUE
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS profiles (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  email VARCHAR(120) UNIQUE,
  location VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url VARCHAR(255),
  cover_url VARCHAR(255),
  profile_url VARCHAR(255),
  bio VARCHAR(10000),
  zip_code INT,
  is_admin BOOLEAN,
  profession VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS events (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name VARCHAR(150),
  latitude VARCHAR(100),
  longitude VARCHAR(100),
  start_date DATETIME,
  end_date DATETIME,
  user_id INT NOT NULL,
  image_url VARCHAR(150),
  description VARCHAR(1000),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  content VARCHAR(2000) NOT NULL,
  time_stamp DATETIME NOT NULL,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  is_one_on_one BOOLEAN NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  last_read_message INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (last_read_message) REFERENCES messages(id),
  UNIQUE KEY `user_per_conversation_id` (user_id, conversation_id)
) ENGINE InnoDB;

ALTER TABLE messages ADD CONSTRAINT fk_conversation_id FOREIGN KEY (conversation_id) REFERENCES conversations(id);

CREATE TABLE IF NOT EXISTS instruments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instrument VARCHAR(100) NOT NULL
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS profiles_instruments (
  profile_id INT NOT NULL,
  instrument_id INT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profiles(id),
  FOREIGN KEY (instrument_id) REFERENCES instruments(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS pictures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  file_name VARCHAR(200) NOT NULL,
  picture_type INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS followers (
  user_id INT NOT NULL,
  follower_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (follower_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS audio (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_name INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS music (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author_user_id INT NOT NULL,
  audio_url VARCHAR(255),
  cover_url VARCHAR(200),
  description VARCHAR(200),
  duration VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  size VARCHAR(50) NOT NULL,
  created_date DATETIME NOT NULL,
  modified_date DATETIME NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (author_user_id) REFERENCES users(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT NOT NULL,
  is_looking BOOLEAN DEFAULT false,
  display_location BOOLEAN DEFAULT false
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS genres (
  id INT PRIMARY KEY AUTO_INCREMENT,
  genre VARCHAR(150) NOT NULL
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS preferred_generes (
  preferences_id INT NOT NULL,
  genre_id INT NOT NULL,
  FOREIGN KEY (preferences_id) REFERENCES preferences(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS notification_status_kind(
  id INT PRIMARY KEY AUTO_INCREMENT,
  kind VARCHAR(16)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS notifications(
  id INT PRIMARY KEY AUTO_INCREMENT,
  kind INT,
  is_deleted INT DEFAULT 0,
  recipient_id INT,
  source_id INT,
  status INT,
  FOREIGN KEY (recipient_id) REFERENCES profiles(id),
  FOREIGN KEY (status) REFERENCES notification_status_kind(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS content_metadata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  url VARCHAR(1000),
  music_id INT,
  event_id INT,
  FOREIGN KEY (music_id) REFERENCES music(id),
  FOREIGN KEY (event_id) REFERENCES events(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS news_item_kind (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kind VARCHAR(50)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS newsfeed (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kind INT,
  text VARCHAR(10000),
  content_metadata INT,
  author INT NOT NULL,
  created_date DATE NOT NULL,
  modified_date DATE,
  source_id INT,
  recipient_id INT,
  FOREIGN KEY (content_metadata) REFERENCES content_metadata(id),
  FOREIGN KEY (author) REFERENCES profiles(id),
  FOREIGN KEY (kind) REFERENCES news_item_kind(id),
  FOREIGN KEY (recipient_id) REFERENCES profiles(id)
) ENGINE InnoDB;

COMMIT;
