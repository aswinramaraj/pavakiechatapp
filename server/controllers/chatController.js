const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat history with a friend
// @route   GET /api/chat/:friendId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    // Get messages between these two users (both directions)
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: friendId },
        { sender: friendId, recipient: userId }
      ]
    })
    .sort({ timestamp: 1 }) // Ascending order by timestamp
    .populate('sender', 'name email')
    .populate('recipient', 'name email');

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Send a message to a friend
// @route   POST /api/chat/:friendId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { friendId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Validate content
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Create and save message
    const message = await Message.create({
      sender: userId,
      recipient: friendId,
      content
    });

    // Populate sender and recipient details
    await message.populate('sender', 'name email');
    await message.populate('recipient', 'name email');

    // Get io instance
    const io = req.app.get('io');
    
    // Emit to recipient
    io.to(friendId.toString()).emit('newMessage', {
      id: message._id,
      content: message.content,
      sender: message.sender,
      recipient: message.recipient,
      timestamp: message.timestamp
    });

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/:friendId/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        sender: friendId,
        recipient: userId,
        read: false
      },
      {
        read: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  markMessagesAsRead
};