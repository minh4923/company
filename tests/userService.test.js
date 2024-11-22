const userService = require('../services/userService');
const User = require('../models/User');
jest.mock('../models/User');

describe('User Service', () => {
  // Test getAllUsers
  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' },
      ];
      const mockSkipLimit = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockUsers),
      };

      User.find.mockReturnValue(mockSkipLimit); // Mock User.find()

      User.countDocuments.mockResolvedValue(2); // Mock countDocuments()

      const result = await userService.getAllUsers(1, 2);

      expect(User.find).toHaveBeenCalled(); // Ensure find() was called
      expect(mockSkipLimit.skip).toHaveBeenCalledWith(0); // Ensure skip was called
      expect(mockSkipLimit.limit).toHaveBeenCalledWith(2); // Ensure limit was called
      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          total: 2,
          page: 1,
          limit: 2,
          totalPage: 1, 
        },
      });
    });

    it('should return empty users if no data found', async () => {
      const mockSkipLimit = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      User.find.mockReturnValue(mockSkipLimit); // Mock User.find()

      User.countDocuments.mockResolvedValue(0); // Mock countDocuments()

      const result = await userService.getAllUsers(1, 10);

      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual({
        users: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPage: 0,
        },
      });
    });
  });
  

  // Test getUserById
  describe('getUserById', () => {
    it('should throw an error for invalid user ID', async () => {
      await expect(userService.getUserById('invalid userId')).rejects.toThrow('Invalid user Id');
    });

    it('should throw an error if user not found', async () => {
      User.findById.mockResolvedValue(null);

      await expect(userService.getUserById('635a1b2c3d4e5f6789012345')).rejects.toThrow('User not found');
    });

    it('should return a user by ID', async () => {
      const mockUser = { name: 'test', email: 'test@example.com' };
      User.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById('635a1b2c3d4e5f6789012345');
      expect(user).toEqual(mockUser);
    });
  });

  // Test updateUser
  describe('updateUser', () => {
    it('should throw an error for invalid user ID', async () => {
      await expect(userService.updateUser('Invalid user Id')).rejects.toThrow('Invalid user Id');
    });

    it('should throw an error if user to update is not found', async () => {
      const mockData = { name: 'test', email: 'test@example', password: 'test1' };
      User.findByIdAndUpdate.mockResolvedValue(null);

      await expect(userService.updateUser('635a1b2c3d4e5f6789012345', mockData)).rejects.toThrow('User not found');
    });

    it('should update a user successfully', async () => {
      const mockData = { name: 'test1', email: 'test1@example', password: 'test1' };
      User.findByIdAndUpdate.mockResolvedValue(mockData);

      const user = await userService.updateUser('635a1b2c3d4e5f6789012345', mockData);
      expect(user).toEqual(mockData);
    });
  });

  // Test deleteUser
  describe('deleteUser', () => {
    it('should throw an error for invalid user ID', async () => {
      await expect(userService.deleteUser('Invalid userId')).rejects.toThrow('Invalid user Id');
    });

    it('should throw an error if user not found', async () => {
      User.findByIdAndDelete.mockResolvedValue(null);
      await expect(userService.deleteUser('635a1b2c3d4e5f6789012345')).rejects.toThrow('User not found');
    });

    it('should delete a user successfully', async () => {
      const mockData = { name: 'test', email: 'test@example.com', password: 'test' };
      User.findByIdAndDelete.mockResolvedValue(mockData);

      const user = await userService.deleteUser('635a1b2c3d4e5f6789012345');
      expect(user).toEqual(mockData);
    });
  });
});
