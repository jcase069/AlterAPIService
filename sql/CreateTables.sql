
CREATE TABLE users
( user_id INTEGER PRIMARY KEY,
  user_name varchar(50) NOT NULL
);

CREATE TABLE blood_sugar
( blood_sugar_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  measurement varchar(10) NOT NULL,
  measurement_time datetime,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE meals
( meal_ID INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  premeal_blood_sugar_id number(6),
  meal_time datetime,
  est_carbs number(10),
  Insulin number(10),
  postmeal_blood_sugar_id number(6),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
  FOREIGN KEY (premeal_blood_sugar_id) REFERENCES blood_sugar(blood_sugar_id),
  FOREIGN KEY (postmeal_blood_sugar_id) REFERENCES blood_sugar(blood_sugar_id)
);

CREATE TABLE photos (
  photo_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  data BLOB,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
