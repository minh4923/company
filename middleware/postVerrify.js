const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SEC || 'aaa'; 
const Post = require('../models/Post');
const { post } = require('../routes/postRoutes');
const postVerify =  async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(401).json({message: 'Token not required'});
    try{
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        req.role = decoded.role;
        if(req.role !== 'admin' &&  req.role !=='user'){
            return res.status(403).json({message: 'Access denied'});
            
        }
        //Lấy id của post từ url
        const {id} =  req.params;
        const post = await  Post.findById(id);
        if(!post){
                return  res.status(404).json({message: 'Post not found12'});
        }
        if(req.role == "user" && post.author.toString() !== req.userId){
            return res.status(403).json({message: 'Acess denide: You are not the owner'});

        }
        next();
    
                
        
    }catch(error){
        return res.status(500).json({message: 'Token verification failed',error: error.message});

    };

}
module.exports = postVerify;