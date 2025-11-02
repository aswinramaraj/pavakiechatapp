const FriendRequest = require('../models/FriendRequest');
const User = require('../models/User');

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    
    if (!recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipient email'
      });
    }

    // Find recipient user
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: req.user._id,
      recipient: recipient._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Friend request already sent'
      });
    }

    // Create friend request
    const friendRequest = await FriendRequest.create({
      sender: req.user._id,
      recipient: recipient._id
    });

    // Get io instance
    const io = req.app.get('io');
    
    // Emit event to recipient if they're online
    io.to(recipient._id.toString()).emit('friendRequest', {
      id: friendRequest._id,
      sender: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      request: friendRequest
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Accept friend request
// @route   POST /api/friends/accept/:requestId
// @access  Private
const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found'
      });
    }

    // Verify recipient is current user
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request'
      });
    }

    request.status = 'accepted';
    await request.save();

    // Get sender details for notification
    const sender = await User.findById(request.sender);

    // Add each user to the other's friends list
    try {
      await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.recipient } });
      await User.findByIdAndUpdate(request.recipient, { $addToSet: { friends: request.sender } });
    } catch (err) {
      console.error('Error updating friends list:', err);
    }

    // Get io instance
    const io = req.app.get('io');
    
    // Notify sender if they're online
    io.to(sender._id.toString()).emit('friendRequestAccepted', {
      id: request._id,
      recipient: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });

    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      request
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all friend requests
// @route   GET /api/friends/requests
// @access  Private
const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      recipient: req.user._id,
      status: 'pending'
    }).populate('sender', 'name email');

    res.status(200).json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get friends list for current user
// @route   GET /api/friends/list
// @access  Private
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('friends', 'name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, friends: user.friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriends
};