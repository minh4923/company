const postController = require('../controllers/postController');
const postService = require('../services/postService');

jest.mock('../services/postService'); // Mock postService

describe('Post Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };    
  });

  // Test getAllPosts
  describe('getAllPosts', () => {
    it('should return paginated posts successfully', async () => {
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
      req.query = {page: '1', limit: '10'};
      postService.getAllPosts.mockResolvedValue(mockPosts);
     

      await postController.getAllPosts(req, res);

      expect(postService.getAllPosts).toHaveBeenCalledWith(1, 10);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle errors when getting all posts', async () => {
      postService.getAllPosts.mockRejectedValue(new Error('Database error'));
      req.query = {page: '1', limit: '10'};
      
      await postController.getAllPosts(req, res);

      expect(postService.getAllPosts).toHaveBeenCalledWith(1, 10 );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  // Test getPostById
  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = { title: 'Post 1', content: 'Content' };
      req.params = { id: '123' };
      postService.getPostById.mockResolvedValue(mockPost);

      await postController.getPostById(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should handle errors when getting a post by ID', async () => {
      req.params = { id: '123' };
      postService.getPostById.mockRejectedValue(new Error('Post not found'));

      await postController.getPostById(req, res);

      expect(postService.getPostById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });
  });

  // Test createPost
  describe('createPost', () => {
    it('should create a new post', async () => {
      const mockPost = { title: 'New Post', content: 'Content' };
      req.body = { title: 'New Post', content: 'Content' };
      req.headers = { authorization: 'Bearer test-token' };
      postService.createPost.mockResolvedValue(mockPost);

      await postController.createPost(req, res);

      expect(postService.createPost).toHaveBeenCalledWith(
        { title: 'New Post', content: 'Content' },
        'test-token'
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    it('should handle errors when creating a post', async () => {
      req.body = { title: 'New Post', content: 'Content' };
      req.headers = { authorization: 'Bearer test-token' };
      postService.createPost.mockRejectedValue(new Error('Unauthorized'));

      await postController.createPost(req, res);

      expect(postService.createPost).toHaveBeenCalledWith(
        { title: 'New Post', content: 'Content' },
        'test-token'
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  // Test updatePost
  describe('updatePost', () => {
    it('should update a post successfully', async () => {
      const mockUpdatedPost = { title: 'Updated Post', content: 'Updated Content' };
      req.params = { id: '123' };
      req.body = { title: 'Updated Post', content: 'Updated Content' };
      postService.updatePost.mockResolvedValue(mockUpdatedPost);

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith('123', req.body);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedPost);
    });

    it('should handle errors when updating a post', async () => {
      req.params = { id: '123' };
      req.body = { title: 'Updated Post', content: 'Updated Content' };
      postService.updatePost.mockRejectedValue(new Error('Invalid post data'));

      await postController.updatePost(req, res);

      expect(postService.updatePost).toHaveBeenCalledWith('123', req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid post data' });
    });
  });

  // Test deletePost
  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      req.params = { id: '123' };
      postService.deletePost.mockResolvedValue();

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted' });
    });

    it('should handle errors when deleting a post', async () => {
      req.params = { id: '123' };
      postService.deletePost.mockRejectedValue(new Error('Post not found'));

      await postController.deletePost(req, res);

      expect(postService.deletePost).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
    });
  });

  // Test getUserPosts
  describe('getUserPosts', () => {
    it('should return all posts for a user', async () => {
      const mockPosts = {
        posts: [
            { title: 'Post 1', content: 'content 1', author:'author 1' },  
            { title: 'Post 2', content: 'content 2', author:'author 2' },
        ],
        pagination: {
            total: 2,
            page: 1,
            limit: 10,
            totalPage: 1,
        },
      };
      
      req.params = { userId: '123' };
      req.query = {page : '1', limit : '10'};
      
      postService.getUserPosts.mockResolvedValue(mockPosts);

      await postController.getUserPosts(req, res);

      expect(postService.getUserPosts).toHaveBeenCalledWith('123',1 , 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle errors when getting user posts', async () => {
      req.params = { userId: '123' };
      req.query = {page : '1' ,limit: '10'};
      postService.getUserPosts.mockRejectedValue(new Error('Invalid user ID'));

      await postController.getUserPosts(req, res);

      expect(postService.getUserPosts).toHaveBeenCalledWith('123',1 , 10);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user ID' });
    });
  });
});
