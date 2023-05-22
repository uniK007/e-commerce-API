const express = require('express');
const router = express.Router();
const {
    registerUser,
    getUsers,
    deleteUserById,
    getUserById,
    updateUserById,
    loginUser,
    logoutUser,
    logoutUserAll,
    forgotPassword,
    resetPassword,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/userAccess');


router.route('/')
    .get(auth, requireRole('admin'), getUsers);

router.route('/register')
    .post(registerUser);

router.route('/:id')
    .get(auth, requireRole('admin'), getUserById)
    .delete(auth, requireRole('admin'), deleteUserById)
    .put(auth, requireRole('admin'), updateUserById);

router.route('/login')
    .post(loginUser);

router.route('/user/logout')
    .post(auth, logoutUser);

router.route('/user/logout-all-devices')
    .post(auth, logoutUserAll);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/reset-password/:token')
    .post(resetPassword);

module.exports = router;