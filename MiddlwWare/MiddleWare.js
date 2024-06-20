const jwt = require("jsonwebtoken");

const jwtAuthMiddleWare = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
        console.log('error', error);
    } 
}


// function genrate web Token

const genrateToken = (user) =>{
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn : '1hour'});
}
  

module.exports = {jwtAuthMiddleWare, genrateToken}