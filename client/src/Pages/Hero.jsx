import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      {/* Header Section */}
    

      {/* First Image Section - Hero with centered content */}
      <section className="hero-top-section">
        <div className="hero-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="8" cy="10" r="1"/>
            <circle cx="12" cy="10" r="1"/>
            <circle cx="16" cy="10" r="1"/>
          </svg>
        </div>
        
        <h1 className="hero-title">
          <span className="title-primary">Connect Instantly with </span>
          <span className="title-accent">Real-Time Chat</span>
        </h1>
        
        <p className="hero-description">
          Experience seamless messaging with instant delivery, typing indicators, and beautiful conversations. 
          Private chats or group discussions - all in one place.
        </p>
        
        <div className="hero-cta-buttons">
          <button className="cta-btn-get-started">Get Started</button>
          <Link to="/signin" className="cta-btn-sign-in">Sign In</Link>
        </div>
      </section>

      {/* Second Image Section - Feature Cards */}
      <section className="hero-features-section">
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
            </div>
            <h2 className="feature-title">Lightning Fast</h2>
            <p className="feature-description">
              Real-time message delivery with instant notifications. Never miss a beat.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h2 className="feature-title">Group Chats</h2>
            <p className="feature-description">
              Create groups for your team, friends, or family. Stay connected together.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-container">
              <svg className="feature-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <h2 className="feature-title">Secure & Private</h2>
            <p className="feature-description">
              Your conversations are protected with enterprise-grade security.
            </p>
          </div>
        </div>

        <p className="trusted-text">
          Trusted by thousands of users worldwide
        </p>

        <div className="footer-icons">
          <div className="footer-icon-container">
            <svg className="footer-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          
          <div className="footer-icon-container">
            <svg className="footer-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          
          <div className="footer-icon-container">
            <svg className="footer-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;

