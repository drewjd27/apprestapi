var connection = require('../connection');
var mysql = require('mysql');
var md5 = require('md5');
var response = require('../res');
var jwt = require('jsonwebtoken');
var config = require('../config/secret');

//controller untuk register
exports.registrasi = function(req, res) {
    var post = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    var query = "SELECT username FROM ?? WHERE ??=?";
    var table = ["users_login", "username", post.username];

    query = mysql.format(query, table);

    connection.query(query, function(error, rows) {
        if(error) {
            console.log(error);
        }else {
            if(rows.length == 0) {
                var query = "INSERT INTO ?? SET ?";
                var table = ["users_login"];
                query = mysql.format(query, table);
                connection.query(query, post, function(error, rows) {
                    if(error) {
                        console.log(error);
                    } else {
                        response.ok("Berhasil mendaftarkan akun!", res);
                    }
                });
            }else {
                response.ok("Username sudah terdaftar!", res);
            }
        }
    })
}

//controller untuk login
exports.login = function(req, res) {
    var post = {
        password: req.body.password,
        username: req.body.username
    }

    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["users_login", "password", md5(post.password), "username", post.username];

    query = mysql.format(query, table);
    connection.query(query, function(error, rows) {
        if(error){
            console.log(error);
        } else {
            if(rows.length == 1) {
                var token = jwt.sign({rows}, config.secret, {
                    expiresIn: 1440
                });
                id_user = rows[0].id_user;

                var data = {
                    id_user: id_user,
                    access_token: token
                }

                var query = "INSERT INTO ?? SET ?";
                var table = ["access_token"];

                query = mysql.format(query, table);
                connection.query(query, data, function(error, rows) {
                    if(error) {
                        console.log(error);
                    } else {
                        res.json({
                            success: true,
                            message: 'Token generated!',
                            token: token,
                            currUser: data.id_user
                        })
                    }
                });
            } else {
                res.json({"Error": true, "Message": "Username atau password salah!"});
            }
        }
    });
}