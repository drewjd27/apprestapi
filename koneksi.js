var mysql = require('mysql');

//buat koneksi database
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'api_bank'
});

conn.connect((err) => {
    if(err) throw err;
    console.log('Mysql terhubung');
});

module.exports = conn;