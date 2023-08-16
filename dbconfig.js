const mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'store'
};
const connection = mysql.createConnection(config);

module.exports = connection;
