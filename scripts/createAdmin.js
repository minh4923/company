// Tạo admin 
const bcrypt = require('bcryptjs');
const User = require('../models/User');
async function createAdmin() {
    const name = 'admin';
    const email = 'minh0367913297@gmail.com';
    const password = 'admin2003';
    const role = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingAdmin  = await User.findOne({email});
    if(!existingAdmin){
        const admin = new User({name, email, password: hashedPassword, role});
        await admin.save();
        console.log('Admin created');

    }else{
        console.log('Admin already exist');
    }
    
}
createAdmin();