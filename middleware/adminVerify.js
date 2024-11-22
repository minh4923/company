const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SEC || 'aaa'; 

const adminVerify = (req, res, next) => {
    // Lấy token từ header
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token not required' });
    }
    
    try {
        // Giải mã token
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        req.role = decoded.role;
        // console.log(req.role);
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Invalid or expired token',
            error: error.message
         });
    }
};

module.exports = adminVerify;
