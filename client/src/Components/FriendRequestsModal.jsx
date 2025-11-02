import React from 'react';
import PropTypes from 'prop-types';

const FriendRequestsModal = ({ isOpen, onClose, requests, onAcceptRequest, onRejectRequest }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Friend Requests</h2>
          <button className="popup-close" onClick={onClose}>
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="popup-content">
          <div className="requests-list">
            {requests.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state-title">No pending requests</p>
                <p className="empty-state-subtitle">When you receive friend requests, they will appear here</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="request-item-popup">
                  <div className="request-avatar">
                    {request.avatar ? (
                      <img src={request.avatar} alt={request.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {request.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="request-info">
                    <h3>{request.name}</h3>
                    <p>{request.email}</p>
                  </div>
                  <div className="request-buttons">
                    <button
                      className="btn-accept"
                      onClick={() => onAcceptRequest(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-decline"
                      onClick={() => onRejectRequest(request.id)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FriendRequestsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      avatar: PropTypes.string
    })
  ).isRequired,
  onAcceptRequest: PropTypes.func.isRequired,
  onRejectRequest: PropTypes.func.isRequired
};

export default FriendRequestsModal;