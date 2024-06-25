const con = require("../db/db");


function query(sql){
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result)=>{
            if (err) return reject(err);
            resolve(result);
        })
    })
}

async function showLead(req, res){
    try {
        const sql = 'select * from leadtable';
        const result = await query(sql);
        res.status(200).send(result);
    } catch (error) {
        res.status(400).send(error)
    } 
}

module.exports = {
    showLead
}