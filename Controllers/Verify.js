const con = require('../db/db'); 

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;
        const query = 'SELECT otp FROM users WHERE email = ?';
        con.query(query, [email], (error, results) => {
            if (error) {
                console.log("Error verifying OTP", error);
                return res.status(500).send('Error verifying OTP');
            }
            if (results.length > 0 && results[0].otp === otp) {
                const updateQuery = "UPDATE users SET is_verified = '1' WHERE email = ?";
                con.query(updateQuery, [email], (updateError, updateResults) => {
                    if (updateError) {
                        return res.status(500).send('Error updating verification status');
                    }
                });
                res.send({ message: 'OTP verified successfully', otp });
            } else {
                res.status(400).send('Invalid OTP');
            }
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    verifyOTP
};
