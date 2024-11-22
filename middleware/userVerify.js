const { response } = require('express');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SEC;
const userVerify = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(403).json({message: 'token not require'});
    try{
        // const  decoded = jwt.verify(token, secret);
        // req.role = decoded.role;
        // if(req.role != 'user' ){
        //     res.status(403).json({message:'acess denied:Pls register an account'});
        // }
        next();
    
    }catch(error){
        res.status(401).json({message:'invaild or expired token '});
    }
}
module.exports = userVerify;