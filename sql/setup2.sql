DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS ingredient CASCADE;
DROP TABLE IF EXISTS planner_day CASCADE;
DROP TABLE IF EXISTS day_recipe CASCADE;
DROP TABLE IF EXISTS planner CASCADE;
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

CREATE TABLE ingredient (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id BIGINT REFERENCES recipe(id),
  description TEXT NOT NULL
);

CREATE TABLE planner_day (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES app_user
);

CREATE TABLE day_recipe (
  recipe_id BIGINT REFERENCES recipe(id),
  planner_day_id BIGINT REFERENCES planner_day(id)
);

INSERT INTO recipe (name) VALUES ('banana bread');

INSERT INTO ingredient (recipe_id, description) VALUES (1, 'banana');
INSERT INTO ingredient (recipe_id, description) VALUES (1, 'bread');


INSERT INTO recipe (name) VALUES ('corndog');

INSERT INTO ingredient (recipe_id, description) VALUES (2, 'corn');
INSERT INTO ingredient (recipe_id, description) VALUES (2, 'dog');


INSERT INTO planner_day DEFAULT VALUES; -- will be the reference for monday

INSERT INTO day_recipe (recipe_id, planner_day_id) VALUES (1, 1); -- add banana bread to monday
INSERT INTO day_recipe (recipe_id, planner_day_id) VALUES (2, 1); -- add corndog to monday

