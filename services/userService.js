const User = require('../models/User');
const mongoose = require('mongoose');
class userService {
    async getAllUsers(page = 1, limit = 10){
        const skip = (page - 1)* limit ;
        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();
        return {
            users,
            pagination:{
                total: totalUsers,
                page,
                limit,
                totalPage: Math.ceil(totalUsers/limit),
            
            },
        };


    }
    async getUserById(id){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Invalid user Id');
        }
        const user =  await User.findById(id);
        if(!user){
            throw new Error('User not found');

        }
        return user;
    }
    async updateUser(id, data){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Invalid user Id');
        }
        const user = await User.findByIdAndUpdate(id, data, {new: true});
        if(!user){
            throw new Error('User not found');

        }
        return user;

    }
    async deleteUser(id){
        if(!mongoose.Types.ObjectId.isValid(id)){
            throw new Error('Invalid user Id');
        }
        const user = await User.findByIdAndDelete(id);
        if(!user){
            throw new Error('User not found');
        }
        return user;
    }
}
module.exports = new userService();