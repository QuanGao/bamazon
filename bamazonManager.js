const inquirer = require("inquirer");

const mysql = require("mysql");

const Table = require("tty-table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function Product(name, price, quantity, department) {
    this.product_name = name;
    this.department_name = department;
    this.price = price;
    this.stock_quantity = quantity;
    this.product_sales = 0;
}

const readInventory = function (cb) {
    connection.query(`SELECT * FROM products`, function (err, res) {
        if (err) throw err;
        cb(res);
    })
}

const displayInventory = function (res) {
    console.log(`

    Here's the full inventory:`);
    displayTable(res);
    chooseTask();

}

const displayTable = function (res) {
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

const findLowStock = function () {
    console.log(`
    Here are items that have less than 5 left in the inventory:
    `);
    connection.query(`SELECT * FROM products WHERE stock_quantity < 5`, function (err, res) {
        if (err) throw err;
        displayTable(res);
        chooseTask();
    })
}

const addStock = function (res) {
    let products = res.map(item => {
        return `${item.item_id}:${item.product_name}`
    })
    inquirer.prompt([{
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
        updateQuant(id_stockUp, num_stockUp);
    })
}

const updateQuant = function (id, num) {
    let query = connection.query(
        `UPDATE products SET stock_quantity = stock_quantity+${num} WHERE ?`, [{
            item_id: id
        }],
        function (err, res) {
            chooseTask();
        })
}

const createNewProduct = function (res) {
    let existingProducts = res.map(item => {
        return item.product_name.toUpperCase();
    });
    connection.query(`SELECT department_name FROM department`, function (err, res) {
        if (err) throw err;
        let existingDepart = res.map(item => {
                return item.department_name;
             });
        inquireNewProduct(existingProducts, existingDepart) 
    })
}

const inquireNewProduct = function (existingProducts, existingDepart) {
    inquirer.prompt([{
            name: "itemName",
            message: "What new product would you like to add?",
            type: "input",
            validate: function (item) {
                return existingProducts.indexOf(item.toUpperCase()) === -1
            }
        },
        {
            name: "itemPrice",
            message: "What is the price tag?",
            type: "input",
            validate: function (num) {
                return Number(num) > 0;
            }

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
            message: "What department would this new product be in?",
            type: "list",
            choices: existingDepart
        }

    ]).then(function (ans) {
        let newProduct = new Product(ans.itemName, parseFloat(ans.itemPrice), parseInt(ans.itemQuant), ans.itemDepart);
        addNewProduct(newProduct)
    })
}

const addNewProduct = function (newProduct) {
    let query = connection.query(
        "INSERT INTO products SET ?",
        newProduct,
        function (err, res) {
            chooseTask();
        })
}

const chooseTask = function () {
    inquirer.prompt([{
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Done for now"]

    }]).then(function (ans) {
        switch (ans.task) {
            case "View Products for Sale":
                readInventory(displayInventory);
                break;
            case "View Low Inventory":
                findLowStock();
                break;
            case "Add to Inventory":
                readInventory(addStock)
                break;
            case "Add New Product":
                readInventory(createNewProduct);
                break;
            case "Done for now":
                connection.end();
                break;
            default:
                return;
        }
    })
}

connection.connect(function (err) {
    if (err) throw err;
    chooseTask();
});