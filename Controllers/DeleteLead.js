 const con = require("../db/db");

 function queryDatabase(sql, id){
    return new Promise((resolve, reject) => {
        con.query(sql, [id], (err, data)=>{
            if (err) {
                reject(err)
            }
            resolve(data)
        })
    })
 }


async function DeleteLead(req, res) {
    try {
        const id = req.params.id;
        const sql = 'DELETE FROM leadtable WHERE id = ?';
        const result = await queryDatabase(sql, id)
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send(error)
        console.log({message : 'error server'});
    }
 }

 module.exports = {
    DeleteLead
 }
