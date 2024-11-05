// controllers/userController.js
const User = require('../models/User');
const Post = require('../models/Post');
// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy một người dùng cụ thể
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {l
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới một người dùng
exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa một người dùng
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Lấy tất cả post của người dùng đăng
exports.getUserPosts = async (req, res) => {
    const { userId} = req.params;

    try{
      // Tìm tất cả các bài viết có userId khớp với ID ngườ dùng 
      const userPosts = await Post.find({userId}).populate('userId');// Sử dụng nếu muốn hiển thị chi tiết người dùng 
      res.json(userPosts);

    }catch (err){
      res.status(500).json({message: err.message});
    }

};