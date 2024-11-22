const userController = require('../controllers/userController');
const userService = require('../services/userService');

jest.mock('../services/userService'); // Mock userService

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllUsers', () => {
    it('should return paginated users successfully', async () => {
      const mockUsers = {
        users: [
          { name: 'User 1', email: 'user1@example.com' },
          { name: 'User 2', email: 'user2@example.com' },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPage: 1,
        },
      };

      req.query = { page: '1', limit: '10' };
      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle default pagination values', async () => {
      const mockUsers = {
        users: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPage: 0,
        },
      };

      req.query = {}; // Không có `page` hoặc `limit`
      userService.getAllUsers.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10); // Mặc định page = 1, limit = 10
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors when getting all users', async () => {
      userService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.getAllUsers(req, res);

      expect(userService.getAllUsers).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  // Test getUserById
  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { name: 'User 1', email: 'user1@example.com' };
      req.params = { id: '123' };
      userService.getUserById.mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle errors when user not found', async () => {
      req.params = { id: '123' };
      userService.getUserById.mockRejectedValue(new Error('User not found'));

      await userController.getUserById(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  // Test updateUser
  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const mockUpdatedUser = { name: 'Updated User', email: 'updated@example.com' };
      req.params = { id: '123' };
      req.body = { name: 'Updated User', email: 'updated@example.com' };
      userService.updateUser.mockResolvedValue(mockUpdatedUser);

      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith('123', req.body);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should handle errors when updating a user', async () => {
      req.params = { id: '123' };
      req.body = { name: 'Updated User', email: 'updated@example.com' };
      userService.updateUser.mockRejectedValue(new Error('Invalid user data'));

      await userController.updateUser(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith('123', req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user data' });
    });
  });

  // Test deleteUser
  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      req.params = { id: '123' };
      userService.deleteUser.mockResolvedValue();

      await userController.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith('123');
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' });
    });

    it('should handle errors when user not found', async () => {
      req.params = { id: '123' };
      userService.deleteUser.mockRejectedValue(new Error('User not found'));

      await userController.deleteUser(req, res);

      expect(userService.deleteUser).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
});
