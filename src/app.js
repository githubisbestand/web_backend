const express = require("express");
const router  = require("./routers/router.js");
const app = express();  
const cors = require("cors");
const port = process.env.port || 5000;

app.use(cors());    
app.use(express.json());

app.use("/", router);



app.listen(port,()=>{
    console.log(`listining to the port no ${port}`); 
})