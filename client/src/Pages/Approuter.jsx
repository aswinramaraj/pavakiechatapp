import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './Hero';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Main from './Main';

const Approuter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        {/* Add more routes here as you create new pages */}
      </Routes>
    </Router>
  );
};

export default Approuter;

