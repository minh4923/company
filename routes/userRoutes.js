const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminVerify  = require('../middleware/adminVerify');
const userVerify = require('../middleware/userVerify');
// Bảo mật các route bằng verifyToken
router.get('/users',adminVerify , userController.getAllUsers);
router.get('/users/:id',adminVerify,  userController.getUserById);
// router.post('/users', verifyToken, userController.createUser);
router.put('/users/:id',adminVerify, userController.updateUser);
router.delete('/users/:id',adminVerify,userController.deleteUser);

module.exports = router;