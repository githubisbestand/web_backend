const con = require("../db/db");


function deleteLead(req, res) {
    const sql = 'delete from leadtable where id = ?';
    const id = req.params.id;
        con.query(sql, [id], (err, data)=>{
            if(err) return res.json();
            return res.json(data);
    
        })
}
module.exports = {
    deleteLead
}