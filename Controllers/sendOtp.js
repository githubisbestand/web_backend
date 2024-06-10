const con = require("../db/db");
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


function getUserDetail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    con.query(query, [email], (error, results) => {
        if (error) {
            return callback(error, null);
        } 
        callback(null, results.length > 0 ? results[0] : null);
    });
}

async function sendOtp(req, res) {
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
}

module.exports = {
    sendOtp
}


