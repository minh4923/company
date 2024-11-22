const Post = require('../models/Post');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

class PostService {
  // Lấy tất cả bài đăng
  async getAllPosts(page = 1, limit = 10 ) {
    const skip = (page - 1 )*limit;
    const posts = await Post.find().skip(skip).limit(limit).populate('author');
    const totalPosts = await Post.countDocuments();
    return {
      posts,
      pagination: {
        total: totalPosts,
        page,
        limit,
        totalPage: Math.ceil(totalPosts/limit),
      },
    };
  }

  // Lấy một bài đăng theo ID
  async getPostById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post Id');
    }
    const post = await Post.findById(id).populate('author');
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  // Tạo mới một bài đăng
  async createPost(data, token) {
    if (!token) {
      throw new Error('You need to log in to perform this action.');
    }
    const decoded = jwt.verify(token, process.env.JWT_SEC || 'aaa');
    const userId = decoded.userId;

    const post = new Post({
      title: data.title,
      content: data.content,
      author: userId,
    });
    const newPost = await post.save();
    // await newPost.populate('author');
    return newPost;
  }

  // Cập nhật một bài đăng
  async updatePost(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post Id');
    }
    const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPost) {
      throw new Error('Post not found1');
    }
    //await updatedPost.populate('author');
    return updatedPost;
  }

  // Xóa một bài đăng
  async deletePost(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid post Id');
    }
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  // Lấy tất cả bài đăng của người dùng
  async getUserPosts(userId,page = 1 , limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID');
    }
    const skip = (page-1)* limit;
    const posts = await Post.find({author: userId}).skip(skip).limit(limit);
    const totalPosts = await Post.countDocuments({author: userId});
    return {
      posts,
      pagination :{
        total: totalPosts,
        page,
        limit,
        totalPage: Math.ceil(totalPosts / limit),
      },
    };
   
   }
}

module.exports = new PostService();
