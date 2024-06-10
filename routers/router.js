const express = require("express");
const router = express.Router();
const con  = require("../db/db");
const userControler = require("../Controllers/SavePAssword");
const authControlers = require("../Controllers/Login");
const verifyControlers = require("../Controllers/Verify");
const sendOtpControlers = require("../Controllers/sendOtp");
const createLeadControlers = require("../Controllers/CreateLead");
const showLeadControlers = require("../Controllers/ShowLead");
const deleteLeadControlers = require("../Controllers/DeleteLead");




router.post("/send-otp",sendOtpControlers.sendOtp);

router.post("/save-password",userControler.savePassword);

router.post("/login-password",authControlers.login);

router.post("/verify-otp", verifyControlers.verifyOTP);

router.post("/create-lead",createLeadControlers.createLead);

router.get("/show-Lead", showLeadControlers.showLead);

router.delete("/deletelead:id",deleteLeadControlers.deleteLead);





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

module.exports = router;