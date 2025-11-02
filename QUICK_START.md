# 🚀 Quick Start Guide

## Backend Setup (5 Minutes)

### Step 1: Create .env File

Navigate to `server` folder and create `.env`:

```bash
cd server
```

Create `.env` with:

```env
MONGODB_URI=mongodb://localhost:27017/pavakie-chatapp
PORT=5000
JWT_SECRET=super-secret-jwt-key-change-in-production-minimum-32-characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:3000
```

### Step 2: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Copy the 16-character password
4. Paste into `.env` as EMAIL_PASS

### Step 3: Start MongoDB

- **Local**: Make sure MongoDB is running
- **Cloud**: Use MongoDB Atlas connection string

### Step 4: Start Server

```bash
cd server
npm run dev
```

You should see:

```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### Step 5: Test It!

Open new terminal:

```bash
# Health check
curl https://pavakie-chatapp.onrender.com/api/health

# Send OTP
curl -X POST https://pavakie-chatapp.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check your email for OTP!
```

## Frontend Setup

### Start React App

```bash
cd client
npm start
```

## All Set! ✅

Your backend is running on `https://pavakie-chatapp.onrender.com`  
Your frontend is running on `http://localhost:3000`

## Need Help?

- Read `server/SETUP.md` for detailed instructions
- Check `BACKEND_IMPLEMENTATION.md` for full docs
- Verify MongoDB is running
- Check Gmail app password is correct
- Look at server logs for errors

## Common Issues

❌ **MongoDB Connection Error**

- Make sure MongoDB is installed and running
- Check MONGODB_URI in .env

❌ **Email Not Sending**

- Generate Gmail app password (not regular password)
- Enable 2-Step Verification first

❌ **Port 5000 Already in Use**

- Change PORT in .env to 5001

❌ **Dependencies Not Installed**

- Run: `cd server && npm install`

## API Endpoints

| Method | Endpoint               | Description     |
| ------ | ---------------------- | --------------- |
| GET    | `/api/health`          | Server status   |
| POST   | `/api/auth/send-otp`   | Send OTP email  |
| POST   | `/api/auth/verify-otp` | Verify OTP code |
| POST   | `/api/auth/signup`     | Register user   |
| POST   | `/api/auth/signin`     | Sign in user    |

## Example Requests

### Send OTP

```json
POST /api/auth/send-otp
{
  "email": "user@example.com"
}
```

### Verify OTP

```json
POST /api/auth/verify-otp
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Sign Up

```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "otp": "123456"
}
```

### Sign In

```json
POST /api/auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}
```

That's it! You're ready to go! 🎉
