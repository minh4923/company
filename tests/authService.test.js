const authService = require('../services/authService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Mock module
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service',() => {
    it('should throw an error if email is already userd', async () =>{
        User.findOne.mockResolvedValue({email: 'test@example.com'});
        await expect(authService.register({name: 'Test', email: 'test@example.com', password: '123123' }))
        .rejects.toThrow('Email has been used');
    });
    it('should register a user successfully', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.prototype.save = jest.fn().mockResolvedValue(true);
        const result = await authService.register({name:'Test', email:'test@example.com',password: '123123'});
        expect(result).toEqual({message: 'Registered successfully!'});
    });
    // Test hàm login khi người dùng không tồn tại
    it('should throw an error if user is not found', async () => {
        User.findOne.mockResolvedValue(null);
        await expect(authService.login({email: 'test@example.com',password: '123123'}))
        .rejects.toThrow('User does not exist');
        
    });
    //Test khi mật khẩu sai 
    it('should throw an error if password is incorrect', async() =>{
        User.findOne.mockResolvedValue({password: 'hashedPasswork'});
        bcrypt.compare.mockResolvedValue(false);
        await expect(authService.login({email: 'test@example.com' ,password:'123123'}))
         .rejects.toThrow('Password is incorrect'); 
    });
    //Test khi mật khẩu đúng
    it('should return a token for valid login', async() =>{
        User.findOne.mockResolvedValue({id:'userId',password:'hashedPassword', role:'user'});
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('testToken');
        const result = await authService.login({email:'test@example.com', password:'123456'});
        expect(result).toEqual({token: 'testToken', message:'Log in successfully'});
    });
    
});