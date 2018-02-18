//   * List a set of menu options:View Products for Sale;View Low Inventory;Add to Inventory ;Add New Product
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
const inq = require("inquirer");
const mysql = require("mysql");
const Table = require("tty-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected!`);
    // chooseTask();
    // readInventory()
    // readInventory(addStock)
    addNewProduct();


});

let chooseTask = function () {
    inq.prompt([{
        name: "task",
        type: "list",
        message: "What would you like to do boss?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Done for now"]

    }]).then(function (ans) {
        switch (ans.task) {
            case "View Products for Sale":
                viewInventory();
                break;
            case "View Low Inventory":
                findLowStock();
                break;
            case "Add to Inventory":
                addStock();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Done for now":
                connection.end();
                break;
            default:
                return;
        }
    })
}



let displayTable = function (res) {
    let header = [{
        value: "item_id",
        width: 10
    }, {
        value: "product_name"
    }, {
        value: "price"
    }, {
        value: "stock_quantity"
    }]
    let productTable = Table(header, res);
    console.log(productTable.render());
}

// let viewInventory = function () {
//     connection.query(`SELECT * FROM products`, function (err, res) {
//         if (err) throw err;
//         console.log(`
//         Here's the full inventory:
//         `);
//         displayTable(res)
//     })
// }

let displayInventory = function (res) {
    console.log(`Here's the full inventory:`);
                        
    displayTable(res)
}

let readInventory = function (cb) {
    connection.query(`SELECT * FROM products`, function (err, res) {
        if (err) throw err;
        cb(res);
    })
}

let addStock = function (res) {
    let products = res.map(item => {
        return `${item.item_id}:${item.product_name}`
    })
    inq.prompt([{
            name: "stockUp",
            message: "What product would you like to stock more?",
            type: "list",
            choices: products
        },
        {
            name: "quant",
            message: "How many would like to add?",
            type: "input",
            validate: function (num) {
                return Number.isInteger(Number(num)) && Number(num) > 0;
            }
        }

    ]).then(function (ans) {
        let id_stockUp = ans.stockUp.split(":")[0];
        let num_stockUp = parseInt(ans.quant);
        console.log(id_stockUp, num_stockUp);
        updateQuant(id_stockUp, num_stockUp);
    })
}

let findLowStock = function () {
    console.log(`
    Here are items that have less than 5 left in the inventory:':
    `);
    connection.query(`SELECT * FROM products WHERE stock_quantity < 100`, function (err, res) {
        if (err) throw err;
        displayTable(res)
    })
}

let updateQuant = function (id, num) {
        let query = connection.query(
            `UPDATE products SET stock_quantity = stock_quantity+${num} WHERE ?`, [
                {
                    item_id: id
                }
            ],
            function (err, res) {
                console.log("updated")
                readInventory(displayInventory)
            })
        }

function Product (name, price, quantity, department){
    this.product_name = name;
    this.department_name = department;
    this.price = price;
    this.stock_quantity = quantity;
}
let addNewProduct = function () {
    inq.prompt([
    {
        name: "itemName",
        message: "What new product would you like to add?",
        type: "input",

    },
    {
        name: "itemPrice",
        message: "What is the price tag?",
        type: "input",

    },
    {
        name: "itemQuant",
        message: "How many would like to stock?",
        type: "input",
        validate: function (num) {
            return Number.isInteger(Number(num)) && Number(num) > 0;
        }
    },
    {
        name: "itemDepart",
        message: "What department would this product be in?",
        type: "input"
    }

]).then(function (ans) {
    let newProduct = new Product (ans.itemName, ans.itemPrice, ans.itemQuant, ans.itemDepart)
    console.log(newProduct)
    let query = connection.query(
        "INSERT INTO products SET ?",
        newProduct
        ,
        function(err, res) {
          console.log("added");
          readInventory(displayInventory)
         
        })
    })
}




        // function Manager() {
        //     this.viewInventory= function () {
        //     };
        //     this.findLowStock = function () {};
        //     this.addStock = function () {

        //     };
        //     this.addNewProduct = function () {

        //     }
        // }