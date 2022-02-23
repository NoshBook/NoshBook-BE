-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

CREATE TABLE app_user (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  password_hash TEXT NOT NULL,
  show_user_content BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE recipe (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id BIGINT REFERENCES app_user(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  tags TEXT[] NOT NULL,
  servings TEXT NOT NULL,
  image TEXT NOT NULL,
  total_time TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  source_url TEXT, -- MAKE NOT NULL LATER ONCE WE FIX RECIPE DATA
  rating FLOAT NOT NULL DEFAULT 0.0,
  ratings_count INT NOT NULL DEFAULT 0
);

