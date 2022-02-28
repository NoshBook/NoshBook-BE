-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;
DROP TABLE IF EXISTS shopping_list CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS cookbook CASCADE;
DROP TABLE IF EXISTS day_planner CASCADE;
DROP TYPE IF EXISTS day_enum CASCADE;

CREATE TABLE app_user (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  show_user_content BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE recipe (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner_id BIGINT REFERENCES app_user(id),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT[] NOT NULL,
  tags TEXT[] NOT NULL,
  servings TEXT NOT NULL,
  image TEXT NOT NULL,
  total_time TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  source_url TEXT,
  rating FLOAT NOT NULL DEFAULT 0.0,
  ratings_count INT NOT NULL DEFAULT 0
);

CREATE TABLE ingredient (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description TEXT NOT NULL,
  recipe_id BIGINT NOT NULL REFERENCES recipe(id)
);

CREATE TABLE shopping_list (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES app_user(id),
  ingredient_id BIGINT NOT NULL REFERENCES ingredient(id),
  is_checked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cookbook (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id BIGINT NOT NULL REFERENCES recipe(id),
  user_id BIGINT NOT NULL REFERENCES app_user(id)
);

CREATE TYPE day_enum AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

CREATE TABLE day_planner (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id BIGINT NULL NULL REFERENCES recipe(id),
  day day_enum NOT NULL,
  user_id BIGINT NOT NULL REFERENCES app_user(id)
);


INSERT INTO app_user (username, password_hash) VALUES ('bob', 'bob');

INSERT INTO recipe (name, description, instructions, tags, servings, image, rating, owner_id) VALUES ('banana bread', 'bread n nanners', ARRAY ['add bread', 'add banana'], ARRAY ['banana', 'bread'], '10 slices', 'picture.com/picture', 3, '1');

INSERT INTO ingredient (recipe_id, description) VALUES (1, 'banana');
INSERT INTO ingredient (recipe_id, description) VALUES (1, 'bread');

INSERT INTO recipe (name, description, instructions, tags, servings, image, rating) VALUES ('corndog', 'dog with corn', ARRAY ['add dog', 'add corn'], ARRAY ['corn', 'dog'], '1', 'picture.com/picture', 1);

INSERT INTO ingredient (recipe_id, description) VALUES (2, 'corn');
INSERT INTO ingredient (recipe_id, description) VALUES (2, 'dog');


INSERT INTO day_planner (recipe_id, day, user_id) VALUES (1, 'monday', 1);
INSERT INTO day_planner (recipe_id, day, user_id) VALUES (2, 'monday', 1); 