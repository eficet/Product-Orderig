const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    var token=req.headers.authorization;
    if(token){
        try{

    var checkToken=jwt.verify(token.split(' ',1),process.env.JWT_SECRET);
    next();
}catch(err){
    return res.status(400).json({message:"auth failed"});
}
    }
    else{
        throw new Error("Auth failed").status=400;
    }
};
