const mysql = require("mysql");

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "Book_Management",
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err) {
        console.log("Data base connected");
    }
    else {
        console.log("Data base connection failed", err);
    }
});
module.exports = mysqlConnection;