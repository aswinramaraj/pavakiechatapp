import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = () => {
    if (!formData.email || !isValidEmail(formData.email)) return;

    setIsOtpSent(false);
    setShowOtpField(false);

    // Call server to send OTP
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Send OTP failed', data);
          alert(data.message || 'Failed to send OTP');
          return;
        }

        setIsOtpSent(true);
        setShowOtpField(true);
        alert('OTP sent to your email');
      } catch (err) {
        console.error(err);
        alert('Network error while sending OTP');
      }
    })();
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) return;

    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, otp })
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Verify OTP failed', data);
          alert(data.message || 'Failed to verify OTP');
          return;
        }

        setOtpVerified(true);
        alert('OTP verified');
      } catch (err) {
        console.error(err);
        alert('Network error while verifying OTP');
      }
    })();
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isEmailValid = formData.email && isValidEmail(formData.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify OTP before signing up');
      return;
    }

    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            otp
          })
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Signup failed', data);
          alert(data.message || 'Signup failed');
          return;
        }

        // Save token and redirect
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Optional: save user info
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect to main
        navigate('/main');
      } catch (err) {
        console.error(err);
        alert('Network error during signup');
      }
    })();
  };

  const navigate = useNavigate();

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="8" cy="10" r="1"/>
            <circle cx="12" cy="10" r="1"/>
            <circle cx="16" cy="10" r="1"/>
          </svg>
        </div>

        <h1 className="signup-title">Join Us</h1>
        <p className="signup-subtitle">Create an account to start chatting</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group email-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="email-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {!isOtpSent && isEmailValid && (
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              )}
            </div>
            
            {showOtpField && (
              <div className="otp-wrapper">
                <input
                  type="text"
                  className="otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength="6"
                />
                <button
                  type="button"
                  className="verify-otp-btn"
                  onClick={handleVerifyOtp}
                >
                  Verify
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={!otpVerified}
          >
            Sign Up
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/signin" className="link-text">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

