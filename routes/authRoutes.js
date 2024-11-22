const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// đăng kí đăng nhập
router.post('/register',authController.register);
router.post('/login',authController.login);
module.exports = router;

