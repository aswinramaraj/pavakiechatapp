# Pavakie Chat App - Backend Server

This is the backend server for the Pavakie Chat App built with Node.js, Express, and MongoDB.

## Features

- User Authentication (Sign up, Sign in)
- Email Verification using OTP
- JWT Token-based Authentication
- MongoDB Database
- Secure Password Hashing with bcrypt
- Email sending with Nodemailer

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `server` directory based on `env.example`:

```bash
cp env.example .env
```

Edit the `.env` file with your actual credentials:

```env
MONGODB_URI=mongodb://localhost:27017/pavakie-chatapp
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CLIENT_URL=http://localhost:3000
```

### 3. MongoDB Setup

Make sure MongoDB is installed and running on your machine:
- Download MongoDB from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud database): https://www.mongodb.com/cloud/atlas

### 4. Gmail App Password (for Nodemailer)

To send emails using Gmail:

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password
5. Use this password in the `EMAIL_PASS` variable

### 5. Run the Server

**Development mode (with nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user

### Health Check

- `GET /api/health` - Check if server is running

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── authController.js  # Auth logic
├── models/
│   └── User.js            # User model
├── routes/
│   └── authRoutes.js      # Auth routes
├── utils/
│   └── sendEmail.js       # Email utility
├── .env                   # Environment variables (create this)
├── env.example            # Environment variables example
├── .gitignore
├── package.json
├── README.md
└── server.js              # Main server file
```

## Testing the API

You can test the API using Postman or curl:

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"test@example.com","password":"password123","otp":"123456"}'
```

### Sign In
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification required
- OTP expiration (10 minutes)
- Input validation
- CORS enabled for frontend

## License

ISC

