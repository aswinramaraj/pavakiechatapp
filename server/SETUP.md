# Backend Setup Instructions

## Quick Setup

### Step 1: Install Dependencies
Dependencies are already installed! ✅

### Step 2: Create .env File
Create a `.env` file in the `server` directory with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/pavakie-chatapp

# Server Port
PORT=5000

# JWT Secret (generate a long random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters-long

# NodeMailer Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### Step 3: MongoDB Setup

**Option A: Local MongoDB**
1. Download and install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/pavakie-chatapp`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pavakie-chatapp`

### Step 4: Gmail Setup for Nodemailer

1. Go to https://myaccount.google.com/
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use it in `EMAIL_PASS` in your `.env` file

### Step 5: Run the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

Server will run on `http://localhost:5000`

### Step 6: Test the API

Open another terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check the MONGODB_URI in .env
- For Atlas: Check if your IP is whitelisted

### Email Not Sending
- Verify Gmail app password is correct
- Make sure 2-Step Verification is enabled
- Check that EMAIL_USER is your actual Gmail address

### Port Already in Use
- Change PORT in .env to another number (e.g., 5001)
- Or stop the process using port 5000

## Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── models/
│   └── User.js            # User database model
├── routes/
│   └── authRoutes.js      # Authentication routes
├── utils/
│   └── sendEmail.js       # Email sending utility
├── .env                   # Environment variables (YOU NEED TO CREATE THIS)
├── env.example            # Example environment file
├── package.json           # Dependencies
├── README.md              # Detailed documentation
└── server.js              # Main server file
```

## API Endpoints

### POST /api/auth/send-otp
Send OTP to user's email
- Body: `{ "email": "user@example.com" }`

### POST /api/auth/verify-otp
Verify the OTP
- Body: `{ "email": "user@example.com", "otp": "123456" }`

### POST /api/auth/signup
Register new user (after OTP verification)
- Body: `{ "name": "John Doe", "email": "user@example.com", "password": "password123", "otp": "123456" }`

### POST /api/auth/signin
Sign in existing user
- Body: `{ "email": "user@example.com", "password": "password123" }`

### GET /api/health
Check server status

## Security Notes

- Never commit `.env` file to Git
- Use a strong JWT_SECRET (minimum 32 characters)
- Keep your app passwords secure
- Use HTTPS in production

## Next Steps

After setup, integrate with your React frontend:
1. Update SignUp.jsx to call `/api/auth/send-otp` and `/api/auth/verify-otp`
2. Update SignIn.jsx to call `/api/auth/signin`
3. Store JWT token in localStorage
4. Add token to API requests

