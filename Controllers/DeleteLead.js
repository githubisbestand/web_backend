const con = require("../db/db");

function DeleteLead(req, res){
    const sql = 'DELETE FROM leadtable WHERE id = ?';
    const id = req.params.id;
    con.query(sql, [id], (err, data)=>{
        if (err) {
            return res.json();
        }
        return res.json(data);
    })
}

module.exports = {
    DeleteLead
}
