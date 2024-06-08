const express = require("express");
const router = express.Router();
const con = require("../db/db.js");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        email : "prakashkumarpandey886@gmail.com",
        pass : " prakash@123 "
    }
});

function otpGenerator(limit){
    const digits = '0123456789';
    let otp = " ";
    for(let i=0; i<limit; i++){
        otp += digits[Math.floor(Math.random()*10)]
    }
    return otp;
}


router.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const checkQuery = 'SELECT email FROM users WHERE email = ?';
    con.query(checkQuery, [email], (checkError, checkResult)=>{
        if(checkError){
            return res.status(500).send("Error checking Email");
        } else if(checkResult.length > 0){
            getUserDetail(email, (error, userDetails) => {
                if (error) {
                    return res.status(500).send('Error retrieving user details');
                } 
                if(userDetails){
                    return res.send(userDetails);
                }
                res.send({ message: 'Email exists, proceed to login' });
                console.log("--------", userDetails);
            });
        } else {
            const otp = otpGenerator(4).trim();
            const query = 'INSERT INTO users (email, otp) VALUES (?, ?)';
            con.query(query, [email, otp], (error, results) => { 
                if (error) {
                    console.error("Error inserting user:", error);
                    return res.status(500).send('Error generating OTP');
                }
                const mailOptions = {
                    from: 'your_email@gmail.com',
                    to: email,
                    subject: 'Your OTP Code',
                    text: `Your OTP code is ${otp}`
                };
                res.send(results);
            });
        }
    });
});


function getUserDetail(email, callback) {
    console.log(email);
    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], (error, results) => {
        if (error) {
            console.log("Error retrieving user details", error);
            return callback(error, null);
        } 
        callback(null, results.length > 0 ? results[0] : null);
    });
}


router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const query = 'SELECT otp FROM users WHERE email = ?';
        con.query(query, [email], (error, results) => {
          if (error) {
            console.log("Error verifying otp", error);
            return res.status(500).send('Error verifying OTP');
          } 
          if (results.length > 0 && results[0].otp === otp) {
            const updateQuery = "UPDATE users SET is_verified = '1' WHERE email = ?";
            con.query(updateQuery, [email], (updateError, updateResults) => {
                if (updateError) {
                    return res.status(500).send('Error updating verification status');
                }
            })    
            res.send({ message: 'OTP verified successfully',  otp });
          } else {
            res.status(400).send('Invalid OTP');
          }
        });
    } catch (error) {
        return res.status(500).send(error)
    }
   
});     

router.post('/save-password',  async (req, res) => {
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
                    console.log("---------------", error);
                    return res.status(500).send('Error saving password');
                }
                res.send({ message: 'Password saved successfully', results });
            });
        });
    } catch (error) {
        return res.status(400).send(error)
    }
    
});


router.post("/login-password", async (req, res) => {
    try {
        
        const { email, password } = req.body;
        const id = await agentID(email);
        const firstName = await checkName(email);
        const results = await queryDatabase('SELECT password FROM users WHERE email = ?', [email]);
        if (results.length > 0) {
            const dbPassword = results[0].password;
            if (password === dbPassword) {
                const response = {
                    name : firstName,
                    id : id
                }
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
});


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
        const findID = await queryDatabase('select id from users where email = ?',[email])
        return findID.length > 0 ? findID[0].id : null;
    } catch (error) {
        console.error('Error querying for user name:', error);
        throw error;   
    }
}


router.post("/create-lead", async (req, res) => {
    try {
        const sql = 'INSERT INTO leadTable(`name`, `email`, `mobile`) VALUES (?, ?, ?)';
        const values = [
            req.body.name,
            req.body.email,
            req.body.mobile
        ];
        con.query(sql, values, (err, data) => {
            if (err) return res.json({ error: err.message });
            return res.json({ message: "Lead created successfully", data });
        });
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.get("/show-lead", async(req, res)=>{
    try {
        const sql = 'select * from leadTable';
        con.query(sql, (err, result)=>{
            if(err) return res.json({message : "inside server error"});
            return res.json(result);
        })
    } catch (error) {
        res.status(400).send(error)
    }
    
})





router.get("/", (req, res)=>{
    const sql = "SELECT * FROM student";
    con.query(sql,(err, result)=>{
        if(err) return res.json({message : "inside server error"});
        return res.json(result);
    })
})


router.post("/singup", (req, res)=>{
      
    con.query('SELECT MAX(id) AS maxId From student',(error,results)=>{
        const newId=results[0].maxId+1;
        const sql = "INSERT INTO student (`id`,`name`, `email`, `password`) values (?)";
        const values = [
            newId,
            req.body.name,
            req.body.email,
            req.body.password,
        ]
        con.query(sql, [values], (err, data)=>{
            if(err) return res.json();
            return res.json(data);
    
        })
    })
   
})

router.post("/login", (req, res)=>{
    const sql  = "INSERT INTO login (`email`, `password`) values (?)";
    const values = [
        req.body.email,
        req.body.password
    ]
    con.query(sql, [values], (err, data) =>{
        if(err) return res.json()
        return res.json(data);
    })
})

router.put("/update/:id", (req, res)=>{
    const sql = "UPDATE student set `name` = ?, `email` = ?, `password` = ? WHERE id = ?";
    const id = req.params.id;
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
    ]
    con.query(sql, [...values, id], (err, data)=>{
        if(err) return res.json();
        return res.json(data);

    })
})




router.delete("/delete/:id", (req, res)=>{
    const sql = "DELETE FROM student WHERE id = ?";
        const id = req.params.id;
        con.query(sql, [id], (err, data)=>{
            if(err) return res.json();
            return res.json(data);
    
        })
})
router.delete("/deletelead/:id", (req, res)=>{
    const sql = 'delete from leadtable where id = ?';
    const id = req.params.id;
        con.query(sql, [id], (err, data)=>{
            if(err) return res.json();
            return res.json(data);
    
        })
})


module.exports = router;