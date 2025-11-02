import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import AddFriendModal from '../Components/AddFriendModal';
import FriendRequestsModal from '../Components/FriendRequestsModal';
import '../Styles/Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const selectedFriendRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [myFriends, setMyFriends] = useState([]);
  const [sidebarTab, setSidebarTab] = useState('requests'); // 'requests' or 'friends'
  const [activeTab, setActiveTab] = useState('requests'); // For popup: 'requests' or 'add'
  const [searchQuery, setSearchQuery] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAddFriendPopup, setShowAddFriendPopup] = useState(false);

  // Function to load chat history
  const loadChatHistory = async (friendId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/${friendId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      } else {
        console.error('Failed to load messages:', data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/${selectedFriend.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Load chat history when selecting a friend
  useEffect(() => {
    if (selectedFriend) {
      loadChatHistory(selectedFriend.id);
    }
    // keep a ref copy so websocket handler can read latest selectedFriend without reattaching
    selectedFriendRef.current = selectedFriend;
  }, [selectedFriend]);

  // Initialize WebSocket once on mount and handle incoming messages
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const newSocket = io(backendUrl, { auth: { token } });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected', newSocket.id);
      newSocket.emit('authenticate', token);
    });

    // support server's 'newMessage' event (emitted on send) and legacy 'message'
    const handleIncoming = (data) => {
      // data expected to contain: senderId, recipientId, content, timestamp
      // If the incoming message belongs to the currently open chat, append it
      const sf = selectedFriendRef.current;
      const belongsToOpenChat = sf && (String(data.sender?._id || data.senderId) === String(sf.id) || String(data.recipient?._id || data.recipientId) === String(sf.id));

      setMessages(prev => [...prev, {
        _id: data.id || data._id || Date.now(),
        sender: { _id: data.sender?._id || data.senderId },
        recipient: { _id: data.recipient?._id || data.recipientId },
        content: data.content,
        timestamp: data.timestamp || new Date().toISOString()
      }]);

      // Optionally, if message not for open chat, you can show a notification badge here
      if (!belongsToOpenChat) {
        // TODO: show unread indicator on friend list
      }
    };

    newSocket.on('newMessage', handleIncoming);
    newSocket.on('message', handleIncoming);

    newSocket.on('friendRequest', (data) => {
      setFriendRequests(prev => [
        {
          id: data.id,
          name: data.sender.name,
          email: data.sender.email,
          avatar: null
        },
        ...prev
      ]);
    });

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [navigate]);

  // Fetch initial friend requests and show welcome alert
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/signin');
          return;
        }

        const res = await fetch('/api/friends/requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok && data.requests) {
          setFriendRequests(data.requests.map(req => ({
            id: req._id,
            name: req.sender.name,
            email: req.sender.email,
            avatar: null
          })));
        }
      } catch (error) {
        console.error('Fetch friend requests error:', error);
      }
    };

    fetchFriendRequests();
    setAlertMessage('Welcome to Chat App!');
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    // Also fetch current friends list
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/friends/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.friends) {
          const friendsList = data.friends.map(f => ({ id: f._id || f.id, name: f.name, email: f.email, avatar: null }));
          setMyFriends(friendsList);
          // If there are friends, show the friends tab and auto-select the first friend
          if (friendsList.length > 0) {
            setSidebarTab('friends');
            // auto-select the first friend to show conversation in main area
            setSelectedFriend(friendsList[0]);
            // optionally load chat history for the selected friend
            loadChatHistory(friendsList[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching friends list:', err);
      }
    };

    fetchFriends();
  }, [navigate]);

  const handleLeave = () => {
    navigate('/signin');
  };
  // User profile from localStorage (set on signin/signup)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    // clear auth and redirect to signin
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/signin');
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const res = await fetch(`/api/friends/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertMessage(data.message || 'Failed to accept friend request');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
        return;
      }

      // Move friend from requests to friends list
      const friend = friendRequests.find(f => f.id === requestId);
      if (friend) {
        setMyFriends([...myFriends, friend]);
        setFriendRequests(friendRequests.filter(f => f.id !== requestId));
        setAlertMessage(`You are now friends with ${friend.name}!`);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      }
    } catch (error) {
      console.error('Accept friend request error:', error);
      setAlertMessage('Network error while accepting friend request');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const handleDeclineRequest = (friendId) => {
    setFriendRequests(friendRequests.filter(f => f.id !== friendId));
    setAlertMessage('Friend request declined.');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleSendFriendRequest = async () => {
    if (!friendEmail || !isValidEmail(friendEmail)) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ recipientEmail: friendEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setAlertMessage(data.message || 'Failed to send friend request');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
        return;
      }

      setAlertMessage('Friend request sent successfully!');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      setFriendEmail('');
    } catch (error) {
      console.error('Send friend request error:', error);
      setAlertMessage('Network error while sending friend request');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const filteredRequests = friendRequests.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFriends = myFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserId = currentUser ? (currentUser._id || currentUser.id) : null;

  return (
    <div className="main-container">
      {/* Left Sidebar */}
      <div className="sidebar">
          <div className="sidebar-header">
          <h1 className="sidebar-title">Messages</h1>
          <div className="sidebar-actions">
            <button 
              className="action-btn"
              onClick={() => setShowAddFriendPopup(true)}
              title="Add Friend"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/>
                <path d="M12 11.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"/>
                <path d="M7 10h2v2H7zm8 0h2v2h-2z"/>
                <circle cx="12" cy="12" r="1.5"/>
              </svg>
            </button>
            {/* Profile avatar button (replaces previous Leave/logout button) */}
            <div style={{ position: 'relative' }}>
              <button
                className="action-btn"
                onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }}
                title={currentUser ? currentUser.name : 'Profile'}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#7B42F6', color: '#fff', fontWeight: '600' }}>
                  {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>

              {showProfileMenu && (
                <div
                  className="profile-menu"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '40px',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 220,
                    zIndex: 50
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#7B42F6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{currentUser ? currentUser.name : 'User'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{currentUser ? currentUser.email : 'no-email'}</div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: '#eee', margin: '12px 0' }} />

                  <button
                    className="logout-btn"
                    onClick={() => handleLogout()}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#ef4444',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="search-container">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="conversations-container">
          {sidebarTab === 'requests' && friendRequests.length > 0 && (
            <>
              {filteredRequests.map(friend => (
                <div key={friend.id} className="conversation-item request-item">
                  <div className="conversation-avatar">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="status-badge">New</span>
                  </div>
                  <div className="conversation-info">
                    <h3 className="conversation-name">{friend.name}</h3>
                    <p className="conversation-email">{friend.email}</p>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="accept-btn"
                      onClick={() => handleAcceptRequest(friend.id)}
                      title="Accept"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </button>
                    <button 
                      className="decline-btn"
                      onClick={() => handleDeclineRequest(friend.id)}
                      title="Decline"
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {sidebarTab === 'friends' && myFriends.length > 0 && (
            <>
              {filteredFriends.map(friend => (
                <div
                  key={friend.id}
                  className={`conversation-item ${selectedFriend?.id === friend.id ? 'active' : ''}`}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="conversation-avatar">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="conversation-info">
                    <h3 className="conversation-name">{friend.name}</h3>
                    <p className="conversation-email">{friend.email}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {(!friendRequests.length && sidebarTab === 'requests') && (
            <div className="empty-state">
              <p className="empty-state-title">No conversations yet</p>
              <p className="empty-state-subtitle">Start a new chat to get going</p>
            </div>
          )}

          {(!myFriends.length && sidebarTab === 'friends') && (
            <div className="empty-state">
              <p className="empty-state-title">No friends yet</p>
              <p className="empty-state-subtitle">Accept friend requests to chat</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Main Area */}
      <div className="main-content">
        {selectedFriend ? (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-user-info">
                {selectedFriend.avatar ? (
                  <img src={selectedFriend.avatar} alt={selectedFriend.name} className="chat-avatar" />
                ) : (
                  <div className="chat-avatar-placeholder">
                    {/* {selectedFriend.name.charAt(0).toUpperCase()} */}
                  </div>
                )}
                <div className="chat-user-details">
                  <h3>{selectedFriend.name}</h3>
                  {/* <p>{selectedFriend.email}</p> */}
                </div>
              </div>
            </div>

            <div className="messages-container" ref={messagesEndRef}>
              {loading ? (
                <div className="loading-messages">Loading messages...</div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message ${msg.sender._id === currentUserId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {msg.sender._id === currentUserId && (
                        <span className="tick" aria-hidden>
                          {/* double tick SVG similar to WhatsApp */}
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13.5L5.5 18L11.5 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                            <path d="M7 13.5L11.5 18L19 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <p>No messages yet</p>
                  <p>Start the conversation!</p>
                </div>
              )}
            </div>

            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="send-message-btn"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                {/* Simple paper-plane SVG (reliable display without FontAwesome) */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-chat">
            <p className="empty-chat-title">Select a chat to start messaging</p>
            <p className="empty-chat-subtitle">or create a new conversation</p>
          </div>
        )}
      </div>

      {/* Add Friend Popup */}
      {showAddFriendPopup && (
        <div className="popup-overlay" onClick={() => setShowAddFriendPopup(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2 className="popup-title">Add Friend</h2>
              <button 
                className="popup-close"
                onClick={() => setShowAddFriendPopup(false)}
              >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="popup-tabs">
              <button
                className={`popup-tab ${activeTab === 'requests' ? 'active' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                Friend Requests ({friendRequests.length})
              </button>
              <button
                className={`popup-tab ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveTab('add')}
              >
                My Friends ({myFriends.length})
              </button>
            </div>

            <div className="popup-content">
              {activeTab === 'add' && (
                <div className="add-friend-form">
                  <div className="form-group">
                    <label htmlFor="friend-email">Friend's Email</label>
                    <div className="input-with-button">
                      <input
                        type="email"
                        id="friend-email"
                        className="form-input"
                        placeholder="Enter email address"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                      />
                      <button
                        className="send-request-btn"
                        onClick={handleSendFriendRequest}
                        disabled={!friendEmail || !isValidEmail(friendEmail)}
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="requests-list">
                  {friendRequests.map(friend => (
                    <div key={friend.id} className="request-item-popup">
                      <div className="request-avatar">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt={friend.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {friend.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="request-info">
                        <h3>{friend.name}</h3>
                        <p>{friend.email}</p>
                      </div>
                      <div className="request-buttons">
                        <button
                          className="btn-accept"
                          onClick={() => {
                            handleAcceptRequest(friend.id);
                            if (friendRequests.length === 1) setActiveTab('add');
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="btn-decline"
                          onClick={() => handleDeclineRequest(friend.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert Box */}
      {showAlert && (
        <div className="alert-box">
          <p>{alertMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Main;

