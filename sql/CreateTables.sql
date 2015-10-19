-- Table 1
CREATE TABLE user
( user_id number(10) NOT NULL,
  user_name varchar(50) NOT NULL,
  CONSTRAINT users_pk PRIMARY KEY (user_id)
);

-- Table 2
CREATE TABLE BloodSugar
( bloodsugar_id number(6) NOT NULL,
  measurement varchar(10) NOT NULL,
  CONSTRAINT blood_sugar_pk PRIMARY KEY (blood_sugar_id)
);

-- Table 3
CREATE TABLE meals
( meal_ID number(10) NOT NULL,
  premeal_blood_sugar_reading varchar(50) NOT NULL,
  bloodsugar_id number(6),
  meal_time datetime,
  Insulin number(10),
  postmeal_blood_sugar_reading(6),
  CONSTRAINT meals_pk PRIMARY KEY (meal_ID),
  CONSTRAINT fk_bloodsugar
    FOREIGN KEY (bloodsugar_id)
    REFERENCES BloodSugar(bloodsugar_id)
);

--Table 4
CREATE TABLE Photos (
meal_ID,
user_ID
);
