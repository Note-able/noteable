Use noteable;
CREATE TABLE IF NOT EXISTS user (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  email VARCHAR(120) UNIQUE,
  password VARCHAR(1000),
  username VARCHAR(30) UNIQUE,
  facebook_id VARCHAR(100) UNIQUE
) EGNINE InnoDB;

CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  email VARCHAR(120) UNIQUE,
  location VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url VARCHAR(255),
  profile_irl VARCHAR(255),
  bio VARCHAR(10000),
  zip_code INT,
  is_admin BOOLEAN,
  profession VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES user(id)
) EGNINE InnoDB;

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
  FOREIGN KEY (user_id) REFERENCES user(id)
) EGNINE InnoDB;

CREATE TABLE IF NOT EXISTS songs (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created DATETIME NOT NULL,
  modified DATETIME,
  FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  content VARCHAR(2000) NOT NULL,
  time_stamp DATETIME NOT NULL,
  conversation_id INT NOT NULL,
  user_id INT NOT NULL,
  is_deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  last_read_message INT,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (last_read_message) REFERENCES messages(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS instruments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  instrument VARCHAR(100) NOT NULL,
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS pictures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  file_name VARCHAR(200) NOT NULL,
  picture_type INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS followers (
  user_id INT NOT NULL,
  follower_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (follow_id) REFERENCES user(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS audio (
  id INT PRIMARY KEY AUTO_INCREMENT,
  file_name INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS music (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author INT NOT NULL,
  cover_url VARCHAR(200),
  description VARCHAR(200),
  duration VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  size VARCHAR(50) NOT NULL,
  created_date DATETIME NOT NULL,
  FOREIGN KEY (author) REFERENCES user(id)
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  profile_id INT NOT NULL,
  is_looking BOOLEAN DEFAULT false,
  display_location DEFAULT false,
) ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS genres (
  id INT PRIMARY KEY AUTO_INCREMENT,
  genre VARCHAR(150) NOT NULL,
) EGNINE InnoDB;

CREATE TABLE IF NOT EXISTS preferred_generes (
  preferences_id INT NOT NULL,
  genre_id INT NOT NULL,
  FOREIGN KEY (preferences_id) REFERENCES preferences(id),
  FOREIGN KEY (genre_id) REFERENCES genres(id)
) ENGINE InnoDB;
