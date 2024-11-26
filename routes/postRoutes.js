// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const adminVerify = require('../middleware/adminVerify');
const userVerify = require('../middleware/userVerify');
const postVerify = require('../middleware/postVerrify');
// Định nghĩa các route và liên kết với controller
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id',postVerify, postController.getPostById);
router.post('/posts',userVerify, postController.createPost);
router.put('/posts/:id',postVerify, postController.updatePost);
router.delete('/posts/:id',postVerify, postController.deletePost);
router.get('/users/:userId/posts', postController.getUserPosts);
module.exports = router;