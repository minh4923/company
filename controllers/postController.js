// controllers/postController.js
const Post = require('../models/Post');

// Lấy tất cả bài đăng
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy một bài đăng cụ thể
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới một bài đăng
exports.createPost = async (req, res) => { 
  const post = new Post(req.body); // Nhận title, content, userId từ req.body
  
  try {
    const newPost = await post.save();
    // Sử dụng .populate để lấy thông tin chi tiết của User mà không dùng execPopulate
    await newPost.populate('userId'); // Thực hiện populate để lấy thông tin chi tiết của userId
    res.status(201).json(newPost); // Trả về post đã populate
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Cập nhật một bài đăng
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    await updatedPost.populate('userId');
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa một bài đăng
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
