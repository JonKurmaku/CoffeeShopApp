CREATE DATABASE coffeeshopdb;

USE coffeeshopdb;

CREATE TABLE orders (
    orders_id INT AUTO_INCREMENT PRIMARY KEY,
    orders_name TEXT,
    orders_email TEXT,
    orders_description TEXT
);
