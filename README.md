# Bamazon

## An Amazon-like storefront CLI written in Node.js
* For [customers](#for-customers), bamazon will take in your order and return the total price.
* For the [store manager](#for-the-manager), bamazon allows you to (1) view the complete inventory or products with low inventory count (2) add more stock to existing products or new products to the inventory
* For the [store supervisor](#for-the-supervisor), bamazon presents you with the options of either view sales information by departments or create new departments

# Installation
1. Clone this repository
```
git clone <bamazonRepo>
```
2. Navigate to the directory and install dependencies
```
npm install
```
3. Run bamazonSeed.sql to initilalize sql database and populate bamazon database with sample data
4.

# Usage

## For customers
```
node bamazonCustomer.js
```
#### Bamazon presents you with our product list and returns the total price as you put in order:

![customer order productt](./gifs/1.gif)

#### Bamazon regrets to inform you when the desired product is out of stock:

![Order productt](./gifs/2.gif)

## For the manager
```
node bamazonManager.js
```
#### View the complete inventory or items that have low inventory count (less than 5):

![View inventory](./gifs/3.gif)

#### Restock products. For example, the Pusheen plush stock is low, let's add more!
Note that after stocking up, Pusheen is not in the low inventory table anymore 

![Add more stocks](./gifs/4.gif)

#### Add new product (milk in this case) in the Food department.
Note that milk is in the inventory table now.

![Add new product](./gifs/5.gif)

## For the supervisor
```
node bamazonSupervisor.js
```
### View sales by department:

![View sales](./gifs/6.gif)

### Create new department:

![New department](./gifs/7.gif)
