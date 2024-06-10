const con = require("../db/db");

exports.savePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkPasswordQuery = 'SELECT password FROM users WHERE email = ?';
        
        con.query(checkPasswordQuery, [email], (checkError, checkResult) => {
            if (checkError) {
                return res.status(500).send("Error checking password");
            }
            if (checkResult.length > 0 && checkResult[0].password) {
                return res.status(400).send("Password is already set and cannot be changed again");
            }
    
            const query = "UPDATE users SET password = ? WHERE email = ? AND is_verified = '1'";
            con.query(query, [password, email], (error, results) => {
                if (error) {
                    return res.status(500).send('Error saving password');
                }
                res.send({ message: 'Password saved successfully', results });
            });
        });
    } catch (error) {
        return res.status(400).send(error);
    }
};
