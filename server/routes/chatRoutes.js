const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage, markMessagesAsRead } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get chat history with a friend
router.get('/:friendId', getChatHistory);

// Send message to a friend
router.post('/:friendId', sendMessage);

// Mark messages as read
router.put('/:friendId/read', markMessagesAsRead);

module.exports = router;