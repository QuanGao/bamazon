const inquirer = require("inquirer");
const mysql = require("mysql");
const Table = require("tty-table");
let numItems;

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`
  Welcome to the bamazon store!`);
  start();
});

function Customer(query_id, query_num) {
  this.query_id = query_id;
  this.query_num = query_num;
}

function displayTable(res) {
  let header = [{
    value: "item_id",
    width: 10
  }, {
    value: "product_name"
  }, {
    value: "price"
  }]
  let productTable = Table(header, res);
  console.log(productTable.render());
  numItems = res.length;
}

function start() {
  console.log(`
  Here are our products for sale:
  `);
  connection.query(`SELECT item_id, product_name, price FROM products`, function (err, res) {
    if (err) throw err;
    displayTable(res)
    askCustomer();
  })
}

function askCustomer() {
  inquirer.prompt([{
      name: "id",
      type: "input",
      message: `
  What product would you like to purchase (enter item_id)?`,
      validate: function (id) {
        return Number.isInteger(Number(id)) && Number(id) > 0 && Number(id) <= numItems;
      }
    },
    {
      name: "quantity",
      type: "input",
      message: `
  How many?`,
      validate: function (num) {
        return Number.isInteger(Number(num)) && Number(num) > 0;
      }
    },
  ]).then(ans => {
    let customer = new Customer(parseInt(ans.id), parseInt(ans.quantity))
    checkStock(customer);
  })
}

function checkStock(customer) {
  connection.query(`SELECT price, stock_quantity, product_sales FROM products WHERE item_id=${customer.query_id}`, function (err, res) {
    if (err) throw err;
    let price = res[0].price;
    let quant = res[0].stock_quantity;
    let sales = res[0].product_sales;
    if (customer.query_num > quant) {
      console.log(`
  insufficient quantity
      `);
      connection.end();
    } else {
      let totalPrice = price * customer.query_num;
      let newStockQuant = quant - customer.query_num;
      updateStock(customer.query_id, newStockQuant, totalPrice, sales);
    }
  })
}

function updateStock(itemID, newQuantity, sum, sales) {
  connection.query(
    "UPDATE products SET ? WHERE ?", [{
        stock_quantity: newQuantity,
        product_sales: sales + sum
      },
      {
        item_id: itemID
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log(`
  Your total is ${sum}
        `);
      connection.end();
    }
  )
}