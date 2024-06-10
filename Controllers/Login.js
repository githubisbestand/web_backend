const con = require("../db/db");
const {genrateToken} = require("../MiddlwWare/MiddleWare");

async function queryDatabase(query, params) {
    return new Promise((resolve, reject) => {
        con.query(query, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

async function checkName(email) {
    try {
        const result = await queryDatabase("SELECT SUBSTRING_INDEX(email, '@', 1) AS name FROM users WHERE email = ?", [email]);
        return result.length > 0 ? result[0].name : null;
    } catch (error) {
        console.error('Error querying for user name:', error);
        throw error;
    }
}

async function agentID(email){
    try {
        const findID = await queryDatabase('select id from users where email = ?',[email]);
        return findID.length > 0 ? findID[0].id : null;
    } catch (error) {
        console.error('Error querying for user ID:', error);
        throw error;   
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const id = await agentID(email);
        const firstName = await checkName(email);
        const results = await queryDatabase('SELECT password FROM users WHERE email = ?', [email]);
        if (results.length > 0) {
            const dbPassword = results[0].password;
            if (password === dbPassword) {
                const token = genrateToken({id, email});
                console.log('Token', token);
                const response = {
                    name: firstName,
                    id: id,
                    token
                };
                res.send(response);
            } else {
                res.status(401).send('Incorrect password');
            }
        } else {
            res.status(404).send('Email not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
}

module.exports = {
    login
};
