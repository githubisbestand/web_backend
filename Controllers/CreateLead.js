const con = require("../db/db");
async function CreateLead(req, res){
    try {
        const sql = 'INSERT into leadtable(name, email, mobile) values (?,?,?)';
        console.log(req.body);
        const values = [
            req.body.name,
            req.body.email,
            req.body.mobile
        ]
        console.log('values',values);
        con.query(sql, values, (err, data)=>{
            if (err) {
               return res.status(400).send(err) 
            }
            return res.status(200).send(data)
        })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports ={
    CreateLead
}