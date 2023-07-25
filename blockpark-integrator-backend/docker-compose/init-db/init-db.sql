CREATE DATABASE IF NOT EXISTS integrator;
USE integrator;
CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  phone_number VARCHAR(255),
  password VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS active_sessions (
  email VARCHAR(255) PRIMARY KEY,
  provider_id VARCHAR(255),
  slot_number VARCHAR(255),
  FOREIGN KEY (email) REFERENCES users(email)
);
/*
 USER TABLE
 */
INSERT INTO users (email, name, phone_number, password)
VALUES (
    'john.doe@example.com',
    'John Doe',
    '123456789',
    '$2a$10$7dIUlXJG4LVfHmMDqjJHeO7WexzNcyYJzQp1Xepdzq0c4FAgd9Lmy'
  ),
  -- Replace with hashed password
  (
    'jane.doe@example.com',
    'Jane Doe',
    '987654321',
    '$2a$10$7dIUlXJG4LVfHmMDqjJHeO7WexzNcyYJzQp1Xepdzq0c4FAgd9Lmy'
  ),
  -- Replace with hashed password
  (
    'alice@example.com',
    'Alice Smith',
    '5551234567',
    '$2a$10$7dIUlXJG4LVfHmMDqjJHeO7WexzNcyYJzQp1Xepdzq0c4FAgd9Lmy'
  );