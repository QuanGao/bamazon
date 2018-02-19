// 4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:
//    * View Product Sales by Department
//    * Create New Department
// 5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

// | department_id | department_name | over_head_costs | product_sales | total_profit |
// | ------------- | --------------- | --------------- | ------------- | ------------ |
// | 01            | Electronics     | 10000           | 20000         | 10000        |
// | 02            | Clothing        | 60000           | 100000        | 40000        |

// 6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

// 7. If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.
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

function Department(name, costs) {
    this.department_name = name;
    this.over_head_costs = costs;
}
let inquireNewDepart = function () {
    inq.prompt([{
            name: "name",
            message: "What new department would you like to add?",
            type: "input"
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



let displayTable = function (res) {
    let header = [{
        value: "department_id",
        width: 10
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

let chooseTask = function () {
    inq.prompt([{
        name: "task",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"]

    }]).then(function (ans) {
        switch (ans.task) {
            case "View Product Sales by Department":
                salesByDepart();
                break;
            case "Create New Department":
                inquireNewDepart()
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