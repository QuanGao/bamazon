// first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// check if your store has enough of the product to meet the customer's request.
// If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
// * item_id product_name department_name price stock_quantity
const inq = require("inquirer");
const mysql = require("mysql");
const Table = require("tty-table")

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log(`Welcome to the bamazon store!`);
    checkStock();
  });


function displayProduct () {
    console.log(`Here are our products for sale`);
    connection.query(`SELECT item_id, product_name, price FROM products`, function(err, res) {
      if (err) throw err;
      let header = [{value:"item_id", width : 10}, {value:"product_name"}, {value:"price"}]
      let productTable = Table(header,res);
      console.log(productTable.render()); 
      connection.end();
    })
}

let query_id = 1;
let query_num = 100;
function checkStock () {
    console.log(`Checking if available`);
    connection.query(`SELECT price, stock_quantity FROM products WHERE item_id=${query_id}`, function(err, res) {
    if (err) throw err;
    let price = res[0].price;
    let quant = res[0].stock_quantity;
    if(query_num>quant){
      console.log("insufficient quantity")
    }else{
      let totalPrice = price * query_num;
      updateStock(query_id,(quant-query_num), totalPrice);
    }


    connection.end();
  })
}

function updateStock (itemID,newQuantity, sum){
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity:newQuantity
      },
      {
        item_id: itemID
      }
    ],function(err, res){
      if(err) throw err;
      console.log(`updated item: ${itemID} with new stock_quantity ${newQuantity}`)
      console.log(`your total is ${sum}`)

    }
  )
}
function Customer (itemId, units){
    this.itemId = itemId;
    this.units = units;
}