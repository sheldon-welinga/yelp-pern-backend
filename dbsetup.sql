
--First add the extension below to start the set up

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--Create database for our project
CREATE DATABASE yelp_pern;

--create a table called restaurants
CREATE TABLE restaurants(
    restaurant_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL CHECK(price_range >=1 AND price_range <=5)
);

--Insert fake restaurants data for testing
INSERT INTO restaurants (name, location, price_range) VALUES('Pizza hut', 'Las Vegas', 3);

--Retrieve data from the table restaurants
SELECT * FROM restaurants;

-- create a table called reviews

CREATE TABLE reviews(
    reviews_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    review TEXT NOT NULL,
    rating INT NOT NULL CHECK(rating>=1 AND rating<=5),
    restaurant_id uuid NOT NULL REFERENCES restaurants (restaurant_id)
);

-- insert fake reviews data for testing
INSERT INTO reviews (name, review, rating, restaurant_id) VALUES ('John', 'This is an awesome place', 2, '776b4731-f2a8-4fc4-acb4-11b346d60a78');