const jwt = require("jsonwebtoken")

function authMiddleware(req,res,next){

    const token = req.headers.token
    const decode = jwt.verify(token,"secret1234567")

    if(decode.userId){
        req.userId= decode.userId
        next()
    }else{
        res.status(403).json({
            message:"Token invalid or not found"
        })
    }
}

module.exports ={
    authMiddleware:authMiddleware
}