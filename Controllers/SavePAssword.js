const { promises } = require("nodemailer/lib/xoauth2");
const con = require("../db/db");



const queryDatabase = (params, query) => {
    return new Promise((resolve, reject) => {
        con.query(params, query, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

async function agentID(email){
   try {
        const findID = await queryDatabase('select id from users where email = ?',[email])
        return findID.length > 0 ? findID[0].id : null;
   } catch (error) {
        console.log("findid error");
        return res.status(500).send(error);
   }
}

async function firstName(email){
    try {
        const findName = await queryDatabase("SELECT SUBSTRING_INDEX(email, '@', 1) AS name FROM users WHERE email = ?",[email])
        return findName.length > 0 ? findName[0].name : null;
    } catch (error) {
        console.error('Error querying for user name:', error);
        throw error;
    }
}


exports.savePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const id = await agentID(email);
        const name = await firstName(email);

        const checkPasswordQuery = 'SELECT password FROM users WHERE email = ?';
        const checkResult = await queryDatabase(checkPasswordQuery, [email]);

        if (checkResult.length > 0 && checkResult[0].password) {
            return res.status(400).send("Password is already set and cannot be changed again");
        }

        const updatePasswordQuery = "UPDATE users SET password = ? WHERE email = ? AND is_verified = '1'";
        const updateResult = await queryDatabase(updatePasswordQuery, [password, email]);

        const response = {
            updateResult,
            id,
            name
        };
        
        res.status(200).send(response);
        
    } catch (error) {
        console.error('Error in savePassword:', error);
        res.status(400).send(error.message);
    }
};