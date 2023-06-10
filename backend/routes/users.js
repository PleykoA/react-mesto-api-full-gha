const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  changeAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
  validationUserId,
} = require('../middlewares/validation');

router.get('/api', getUsers);
router.get('/me', getCurrentUser);
router.get('/api:userId', validationUserId, getUserById);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, changeAvatar);
module.exports = router;
