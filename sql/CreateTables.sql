BEGIN;

-- Table 1
CREATE TABLE user
( user_id number(10) NOT NULL,
  user_name varchar(50) NOT NULL,
  CONSTRAINT users_pk PRIMARY KEY (user_id)
);

-- Table 2
CREATE TABLE BloodSugar
( blood_sugar_id number(6) NOT NULL,
  user_id number(10) NOT NULL,
  measurement varchar(10) NOT NULL,
  CONSTRAINT blood_sugar_pk PRIMARY KEY (blood_sugar_id)
);

-- Table 3
CREATE TABLE meals
( meal_ID INT PRIMARY KEY,
  premeal_blood_sugar_id number(6),
  meal_time datetime,
  est_carbs number(10),
  Insulin number(10),
  postmeal_blood_sugar_id number(6),
  CONSTRAINT fk_bloodsugar1
    FOREIGN KEY (premeal_blood_sugar_id)
    REFERENCES BloodSugar(blood_sugar_id),
  CONSTRAINT fk_bloodsugar2
    FOREIGN KEY (postmeal_blood_sugar_id)
    REFERENCES BloodSugar(blood_sugar_id)
);

--Table 4
CREATE TABLE Photos (
  user_id number(10) NOT NULL,
  data BLOB
);

COMMIT;
