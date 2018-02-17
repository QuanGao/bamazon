
const inq = require("inquirer");
const mysql = require("mysql");
const Table = require("tty-table");
let query_id;
let query_num;
let numItems;

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
    displayProduct();
  });


function displayProduct () {
    console.log(`Here are our products for sale`);
    connection.query(`SELECT item_id, product_name, price FROM products`, function(err, res) {
      if (err) throw err;
      let header = [{value:"item_id", width : 10}, {value:"product_name"}, {value:"price"}]
      let productTable = Table(header,res);
      console.log(productTable.render());
      numItems = res.length;
      console.log(`num of different items: ${numItems}`)
      askCustomer(); 
    })
}


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
function askCustomer(){
  inq.prompt([
    {
      name:"id",
      type:"input",
      message: "what product would you like to purchase (enter item_id)?",
      validate: function validateGuess(id) {
        let float = parseFloat(id)
        return Number.isInteger(float) && float >= 0 && float <= numItems;
      }
    },
    {
      name:"quantity",
      type:"input",
      message: "how many?",
      validate: function validateGuess(num) {
        return Number.isInteger(parseFloat(num));
      }
    },
  ]).then(ans => {
    query_id = ans.id;
    query_num = ans.quantity;
    console.log(query_num, query_id)
    checkStock();
  

  })
}

