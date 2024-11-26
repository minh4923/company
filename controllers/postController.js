const postService = require('../services/postService');

// Lấy tất cả bài đăng
const getAllPosts = async (req, res) => {
  const {page = 1, limit = 10} = req.query || {};
  const parsedPage = parseInt(page, 10)||1;
  const parsedLimit = parseInt(limit, 10)||10;

  try {
    
    const posts = await postService.getAllPosts(parsedPage, parsedLimit);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy một bài đăng theo ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postService.getPostById(id);
    res.json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Tạo mới một bài đăng
const createPost = async (req, res) => {
  const { title, content } = req.body;
  const token = req.headers['authorization']?.split(' ')[1];

  try {
    const newPost = await postService.createPost({ title, content }, token);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

// Cập nhật một bài đăng
const updatePost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedPost = await postService.updatePost(id, data);
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa một bài đăng
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await postService.deletePost(id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Lấy tất cả bài đăng của một người dùng
const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const { page = 1, limit = 10} =  req.query || {};
  const parsedPage = parseInt(page, 10)||1;
  const parsedLimit = parseInt(limit, 10)||10;
  try {
    const userPosts = await postService.getUserPosts(userId, parsedPage, parsedLimit);
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {getAllPosts, getPostById, createPost, updatePost, deletePost, getUserPosts};