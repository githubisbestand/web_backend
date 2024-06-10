const con = require("../db/db");


async function createLead(req, res){
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
}

module.exports = {
    createLead
}