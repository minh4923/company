const postService = require('../services/postService');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
jest.mock('../models/Post');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Post Service', () => {
  // Test getAllPosts
  describe('getAllPosts', () => {
    it('should return paginated posts', async () => {
      const mockPosts ={
        posts: [
          {title: 'Post 1', content: 'Content 1', author: 'author 1' },
          {title: 'Post 2', content: 'Content 2', author: 'author 2' },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPage: 1,
          },
      };

      const mockSkipLimit = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockPosts.posts),
      };
        
        Post.find.mockReturnValue(mockSkipLimit);
        Post.countDocuments.mockResolvedValue(2);
        const result = await postService.getAllPosts(1, 10);
        expect(result).toEqual(mockPosts);

        expect(Post.find).toHaveBeenCalled();
        expect(Post.find().skip).toHaveBeenCalledWith(0);
        expect(Post.find().limit).toHaveBeenCalledWith(10);
        expect(Post.find().populate).toHaveBeenCalledWith('author');
        expect(Post.countDocuments).toHaveBeenCalled();
       
    });
  });

  // Test getPostById
  describe('getPostById', () => {
    it('should throw an error for invalid post ID', async () => {
        await expect(postService.getPostById('invalid-id'))
        .rejects.toThrow('Invalid post Id');
    });

    it('should throw an error if post not found', async () => {
        Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(postService.getPostById('635a1b2c3d4e5f6789012345')).rejects.toThrow('Post not found');
    });

    it('should return a post for a valid ID', async () => {
      const mockPost = { title: 'Sample Post', content: 'Sample Post', author: 'authorId' };
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPost),
      });

      const post = await postService.getPostById('635a1b2c3d4e5f6789012345');
      expect(post).toEqual(mockPost);
    });
  });

  // Test createPost
  describe('createPost', () => {
    it('should throw an error if no token is provided', async () => {
      await expect(postService.createPost({ title: 'New Post', content: 'Content' })).rejects.toThrow(
        'You need to log in to perform this action'
      );
    });

    it('should create a new post successfully', async () => {
      const mockPostData = { title: 'New post', content: 'Content' };
      const savedPost = { ...mockPostData, author: 'userId', _id: '635a1b2c3d4e5f6789012345' };

      jwt.verify.mockReturnValue({ userId: 'userId' });
      Post.prototype.save = jest.fn().mockResolvedValue(savedPost);

      const post = await postService.createPost(mockPostData, 'valid-token');
      expect(post).toEqual(savedPost);
    });
  });

  // Test updatePost
  describe('updatePost', () => {
    it('should throw an error for invalid post ID when updating', async () => {
      await expect(postService.updatePost('Invalid_id post', { title: 'update title' })).rejects.toThrow(
        'Invalid post Id'
      );
    });

    it('should throw an error if post not found when updating', async () => {
      Post.findByIdAndUpdate.mockResolvedValue(null);
      await expect(postService.updatePost('635a1b2c3d4e5f6789012345', { title: 'Upadate title' })).rejects.toThrow(
        'Post not found'
      );
    });

    it('should update a post successfully', async () => {
      const updateData = { title: 'Update title', content: 'Delete content' };
      const updatePost = { ...updateData, author: 'author_Id', _id: '635a1b2c3d4e5f6789012345' };

      Post.findByIdAndUpdate.mockResolvedValue(updatePost);

      const post = await postService.updatePost('635a1b2c3d4e5f6789012345', updateData);
      expect(post).toEqual(updatePost);
    });
  });

  // Test deletePost
  describe('deletePost', () => {
    it('should throw an error for invalid post ID when deleting', async () => {
      await expect(postService.deletePost('Invalid_id post')).rejects.toThrow('Invalid post Id');
    });

    it('should throw an error if post not found when deleting', async () => {
      Post.findByIdAndDelete.mockResolvedValue(null);
      await expect(postService.deletePost('635a1b2c3d4e5f6789012345')).rejects.toThrow('Post not found');
    });

    it('should delete a post successfully', async () => {
      const deleteData = { title: 'test', content: 'test', author: 'author_id' };
      Post.findByIdAndDelete.mockResolvedValue(deleteData);
      const posts = await postService.deletePost('635a1b2c3d4e5f6789012345');
      expect(posts).toEqual(deleteData);
    });
  });

  // Test getUserPosts
  describe('getUserPosts', () => {
    it('should throw an error for invalid user ID when getting user posts', async () => {
      await expect(postService.getUserPosts('invalid user Id')).rejects.toThrow('Invalid user ID');
    });

    it('should return all posts by user ID successfully', async () => {
        const mockPosts ={
            posts: [
              {title: 'Post 1', content: 'Content 1', author: 'author 1' },
              {title: 'Post 2', content: 'Content 2', author: 'author 2' },
            ],
            pagination: {
              total: 2,
              page: 1,
              limit: 10,
              totalPage: 1,
            },
        };
        const mockSkipLimit = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(mockPosts.posts),
        };
        Post.find.mockReturnValue(mockSkipLimit);
        Post.countDocuments.mockResolvedValue(2);
        
        const posts = await postService.getUserPosts('635a1b2c3d4e5f6789012345', 1,  10);
        expect(posts).toEqual(mockPosts);
        expect(Post.find).toHaveBeenCalled();
        expect(Post.find().skip).toHaveBeenCalledWith(0);
        expect(Post.find().limit).toHaveBeenCalledWith(10);
        
         
    });
  });




});
