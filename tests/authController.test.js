const authController = require('../controllers/authController');
const authService = require('../services/authService');

jest.mock('../services/authService'); // Mock authService

describe('Auth Controller', () => {
  // Test hàm register
  describe('register', () => {
    it('should register a user successfully', async () => {
      const req = {
        body: { name: 'Test User', email: 'test@example.com', password: '123456' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockResult = { message: 'Đăng ký thành công!' };
      authService.register.mockResolvedValue(mockResult); // Mock authService.register

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle server error during registration', async () => {
      const req = {
        body: { name: 'Test User', email: 'test@example.com', password: '123456' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authService.register.mockRejectedValue(new Error('Database error')); // Mock lỗi từ authService.register

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  // Test hàm login
  describe('login', () => {
    it('should login successfully', async () => {
      const req = {
        body: { email: 'test@example.com', password: '123456' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockResult = { token: 'testToken', message: 'Đăng nhập thành công' };
      authService.login.mockResolvedValue(mockResult); // Mock authService.login

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid login credentials', async () => {
      const req = {
        body: { email: 'test@example.com', password: 'wrongPassword' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      authService.login.mockRejectedValue(new Error('Invalid credentials')); // Mock lỗi từ authService.login

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });
});
