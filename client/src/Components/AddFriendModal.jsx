import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddFriendModal = ({ isOpen, onClose, onAddFriend }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onAddFriend(email.trim());
      setEmail('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Add New Friend</h2>
          <button className="popup-close" onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="popup-content">
          <form className="add-friend-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="friend-email">Friend's Email</label>
              <div className="input-with-button">
                <input
                  type="email"
                  id="friend-email"
                  className="form-input"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="send-request-btn"
                  disabled={!email.trim()}
                >
                  Send Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddFriendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddFriend: PropTypes.func.isRequired
};

export default AddFriendModal;