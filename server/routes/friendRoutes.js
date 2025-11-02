const express = require('express');
const router = express.Router();
const { sendFriendRequest, acceptFriendRequest, getFriendRequests } = require('../controllers/friendController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected - require valid JWT
router.use(protect);

// @route   POST /api/friends/request
// @desc    Send friend request
// @access  Private
router.post('/request', sendFriendRequest);

// @route   POST /api/friends/accept/:requestId
// @desc    Accept friend request
// @access  Private
router.post('/accept/:requestId', acceptFriendRequest);

// @route   GET /api/friends/requests
// @desc    Get all friend requests
// @access  Private
router.get('/requests', getFriendRequests);

// @route   GET /api/friends/list
// @desc    Get friends list for current user
// @access  Private
router.get('/list', require('../controllers/friendController').getFriends);

module.exports = router;