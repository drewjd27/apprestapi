'use-strict';

var response = require('./res');
var connection = require('./connection');

exports.index = function(req, res) {
    response.ok("REST API sedang berjalan!", res)
}

//menampilkan semua data nasabah
exports.getAllNasabah = function(req, res) {
    connection.query('SELECT * FROM customers', function(error, rows, fields) {
        if (error) {
            connection.log(error);
        } else {
            response.ok(rows, res)
        }
    });
};