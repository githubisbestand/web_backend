const mysql = require("mysql");
const dotenv = require("dotenv").config();


const con = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

con.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connection successfull....");
    }
})

module.exports = con;