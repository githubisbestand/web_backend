const con = require("../db/db");


function queryDatabase(sql, values){
    return new Promise((resolve, reject) => {
        con.query(sql,values, (err, result)=>{
            if(err){
                reject(err)
            }
            resolve(result)
        })
    })
}


async function singup(req, res){
    try {
        const sql = 'INSERT into student(name, email, password) values (?,?,?)';
        const values = [
            req.body.name,
            req.body.email,
            req.body.password
        ]
        const result =  await queryDatabase(sql, values);
        console.log('values',result);
        res.status(200).send(result);
    
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error)
    }
}
module.exports ={
    singup
}