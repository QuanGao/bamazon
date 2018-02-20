
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("HomePod", "Electronics", 350, 20, 0),
("USB Drive", "Electronics", 20.39, 100, 0),
("Socks", "Clothing", 5.96, 2000, 0),
("Jeans", "Clothing", 55.36, 1000, 0),
("Cat Food", "Pet spplies", 30.12, 300, 0),
("Dog Food", "Pet spplies", 55.30, 500, 0),
("Start Wars Lego", "Toys", 300.55, 50, 0),
("Pusheen Plush", "Toys", 200.90, 50, 0),
("Fire and Fury", "Books", 25.99, 200, 0),
("Pride and Rrejudice", "Books", 15.88, 200, 0);

select * from products;

CREATE TABLE department(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO department (department_name, over_head_costs)
VALUES ("Electronics", 1000),
("Clothing", 1000),
("Pet spplies", 1000),
("Toys", 1000),
("Books", 1000),
("Food", 1000),
("Sports", 1000),
("Home", 1000),
("Kitchen", 1000),
("Hygiene", 1000);