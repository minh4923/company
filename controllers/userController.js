const userService = require('../services/userService');

// Lấy danh sách người dùng
const getAllUsers = async (req, res) => {
  const {page = 1, limit = 10 } = req.query||{};
  const parsedPage = parseInt(page, 10)||1;
  const parsedLimit = parseInt(limit, 10)||10;
  try {
    const users = await userService.getAllUsers(parsedPage,parsedLimit);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy một người dùng theo ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await userService.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa một người dùng
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
module.exports = {getAllUsers, getUserById, updateUser, deleteUser};