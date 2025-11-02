import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/SignIn.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (!res.ok) {
          console.error('Signin failed', data);
          alert(data.message || 'Sign in failed');
          return;
        }

        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        navigate('/main');
      } catch (err) {
        console.error(err);
        alert('Network error during sign in');
      }
    })();
  };

  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="8" cy="10" r="1"/>
            <circle cx="12" cy="10" r="1"/>
            <circle cx="16" cy="10" r="1"/>
          </svg>
        </div>

        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to continue your conversations</p>

        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
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

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        <p className="signin-link">
          Don't have an account? <Link to="/signup" className="link-text">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

