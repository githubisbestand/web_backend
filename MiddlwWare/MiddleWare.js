const jwt = require("jsonwebtoken");

const jwtAuthMiddleWare = (req, res, Next)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error : 'Unauthoeized'});

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        res.user = decode;
        Next();
    } catch (error) {
        console.log(error);
        res.status(401).json({error :"Invailed Token"})
    }
    
}

// function genrate web Token

const genrateToken = (user) =>{
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn : '1hour'});
}



module.exports = {jwtAuthMiddleWare, genrateToken};