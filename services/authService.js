const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const secret = process.env.JWT_SEC || 'aaa';

class AuthService {
  // Đăng ký người dùng
  async register({ name, email, password }) {
    // Kiểm tra nếu email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email has been used');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return { message: 'Registered successfully!' };
  }

  // Đăng nhập người dùng
  async login({ email, password }) {
    // Kiểm tra nếu người dùng tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Password is incorrect');
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: '10m' }
    );

    return { token, message: 'Log in successfully' };
  }
}

module.exports = new AuthService();
