const mysql = require("mysql");
const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password : "prakash123",
    database : "singup"
})

con.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connection successfull....");
    }
})

module.exports = con;