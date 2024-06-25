const con = require("../db/db");


function queryDatabase(sql,id,values) {
    return new Promise((resolve, reject) => {
        con.query(sql, [...values, id],(err, data)=>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

async function UpdateLead(req, res){
    try {
        const update = 'UPDATE leadtable set `name` = ? `email` = ? `mobile` = ? where id = ?';
        const id = req.params.id;
        const values = [
            req.body.name,
            req.body.email,
            req.body.mobile,
        ]
        const updated = await queryDatabase(update, values, id)
        res.status(200).send(updated);
    } catch (error) {
        console.log('error genrate == ', error);
        res.status(500).send(error);
    }
}

module.exports = {
    UpdateLead
}