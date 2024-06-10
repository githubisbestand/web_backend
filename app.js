const express = require("express");
const router = require("./routers/router");
const app = express();  
const cors = require("cors");
const dotenv = require("dotenv").config();
const port = process.env.port ;


app.use(cors());    
app.use(express.json());

app.use("/", router);


app.listen(port,()=>{
    console.log(`listining to the port no ${port}`); 
})