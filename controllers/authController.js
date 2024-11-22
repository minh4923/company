const authService = require('../services/authService');

// Đăng ký người dùng
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập người dùng
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = {login, register};