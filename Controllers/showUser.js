const con = require("../db/db");

function showUser(req, res){
    const {email, password} = req.body;

    const query = 'select name, address from users where email = ?' ;

    con.query(query, [email],(error, result)=>{
        if(error){
            return res.status(400).send(error)
        }
        return res.status(200).send(result)
    })
}
module.exports = {
    showUser
}