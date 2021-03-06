INSERT INTO app_user (username, password_hash) VALUES ('bob', 'bob');

INSERT INTO recipe (name, description, instructions, tags, servings, image, rating, owner_id, is_public) VALUES ('banana bread', 'bread n nanners', ARRAY ['add bread', 'add banana'], ARRAY ['banana', 'bread'], '10 slices', 'picture.com/picture', 3, '1', true);
INSERT INTO recipe (name, description, instructions, tags, servings, image, rating, owner_id, is_public) VALUES ('banana cake', 'bread n nanners', ARRAY ['add bread', 'add banana'], ARRAY ['banana', 'bread'], '10 slices', 'picture.com/picture', 2, '1', true);
INSERT INTO recipe (name, description, instructions, tags, servings, image, rating, owner_id, is_public) VALUES ('chocolate cake', 'bread n nanners', ARRAY ['add bread', 'add banana'], ARRAY ['banana', 'bread'], '10 slices', 'picture.com/picture', 4, '1', true);

INSERT INTO ingredient (recipe_id, description) VALUES (1, 'banana');
INSERT INTO ingredient (recipe_id, description) VALUES (1, 'bread');

INSERT INTO recipe (name, description, instructions, tags, servings, image, rating) VALUES ('corndog', 'dog with corn', ARRAY ['add dog', 'add corn'], ARRAY ['corn', 'dog'], '1', 'picture.com/picture', 1);


INSERT INTO ingredient (recipe_id, description) VALUES (2, 'corn');
INSERT INTO ingredient (recipe_id, description) VALUES (2, 'dog');

INSERT INTO day_planner (recipe_id, day, user_id) VALUES (1, 'monday', 1);
INSERT INTO day_planner (recipe_id, day, user_id) VALUES (2, 'monday', 1); 

INSERT INTO cookbook (recipe_id, user_id) VALUES(1, 1);
