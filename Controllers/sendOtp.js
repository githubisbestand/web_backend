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


function queryDatabase(params, query){
  return new Promise((resolve, reject) => {
    con.query(params, query,(err, result)=>{
        if (err) {
          reject(err)
        }
        resolve(result)
    });
  });
}


async function getUserDetail(email){
    try {
          const details = await queryDatabase('SELECT * FROM users WHERE email = ?',[email])
          return details.length > 0 ? details[0] : null;
    } catch (error) {
          console.log({ message: 'error getUserDetails', error });
          throw error;
    }
}



async function sendOtp(req, res){
  try {
    const { email } = req.body;
    const checkQuery = 'SELECT email FROM users WHERE email = ?';
    const checkResult = await queryDatabase(checkQuery, [email]);
    console.log(checkResult);

    if (checkResult.length > 0) {
      const usersDetails = await getUserDetail(email);
      if(usersDetails){
        return res.status(200).send(usersDetails);
      }
      res.send({ message: 'Email exists, proceed to login' });
      console.log("--------", usersDetails);
    } else{
      const otp = otpGenerator(4).trim();

      const query = 'INSERT INTO users (email, otp) VALUES (?, ?)';
      const results = await queryDatabase(query, [email,otp]);
  
      const mailOptions = {
          from: 'prakashkumarpandey126@gmail.com',
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP code is ${otp}`
      };
     res.send(results)
    }
  } catch (error) {
    res.status(500).send(error);
    console.log('error', error);
  } 
}

module.exports = {
    sendOtp
}

