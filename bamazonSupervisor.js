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

function Department(name, costs) {
    this.department_name = name;
    this.over_head_costs = costs;
}

const createNewDepartment = function (res) {
    let existingDepart = res.map(item => {
        return (item.department_name).toLowerCase();
    });
    inquireNewDepart(existingDepart)
}

const readDepartment = function (cb) {
    connection.query(`SELECT * FROM department`, function (err, res) {
        if (err) throw err;
        cb(res);
    })
}

const inquireNewDepart = function (existingDepart) {
    inquirer.prompt([{
            name: "name",
            message: "What new department would you like to add?",
            type: "input",
            validate: function (name) {
                return existingDepart.indexOf(name.toLowerCase()) === -1;
            }
        },
        {
            name: "costs",
            message: "What is the over head costs for this new department?",
            type: "input",
            validate: function (num) {
                return Number(num) > 0;
            }
        }
    ]).then(function (ans) {
        let newDepartment = new Department(ans.name, parseFloat(ans.costs))
        let query = connection.query(
            "INSERT INTO department SET ?",
            newDepartment,
            function (err, res) {
                chooseTask();
            })
    })
};

const displayTable = function (res) {
    let header = [{
        value: "department_id",
        width: 16
    }, {
        value: "department_name"
    }, {
        value: "over_head_costs"
    }, {
        value: "product_sales"
    }, {
        value: "total_profit"
    }]
    let productTable = Table(header, res);
    console.log(productTable.render());
}

const sumSalesByDepart = function () {
    connection.query(`
    SELECT department.*, IFNULL(product_sales,"0") AS product_sales, (IFNULL(product_sales,0) - over_head_costs) AS total_profit
    FROM  department
    LEFT JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY department_name) AS sales 
    USING (department_name);`,
        function (err, res) {
            if (err) throw err;
            displayTable(res);
            chooseTask();
        }
    )
}

const chooseTask = function () {
    inquirer.prompt([{
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department", "Done for now"]

    }]).then(function (ans) {
        switch (ans.task) {
            case "View Product Sales by Department":
                sumSalesByDepart();
                break;
            case "Create New Department":
                readDepartment(createNewDepartment)
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