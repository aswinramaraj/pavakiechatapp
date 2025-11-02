const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // Make name optional at creation (OTP flow). Signup endpoint enforces name presence.
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    // Password is optional during OTP-only user creation.
    // Signup endpoint requires a password and will validate length.
    minlength: [6, 'Password must be at least 6 characters']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: {
      type: String,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  ,
  // List of friend user ids
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes from now
  };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(otpCode) {
  if (!this.otp || !this.otp.code || !this.otp.expiresAt) {
    return false;
  }
  
  if (Date.now() > this.otp.expiresAt) {
    return false; // OTP expired
  }
  
  return this.otp.code === otpCode;
};

module.exports = mongoose.model('User', userSchema);

