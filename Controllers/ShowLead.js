const con = require("../db/db");

async function showLead(req, res){
    try {
        const sql = 'select * from leadtable';
        con.query(sql, (err, result)=>{
            if(err) return res.json({message : "inside server error"});
            return res.json(result);
        })
    } catch (error) {
        res.status(400).send(error)
    } 
}

module.exports = {
    showLead
}