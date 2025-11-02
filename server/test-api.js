/**
 * Simple API Testing Script
 * Run with: node test-api.js
 */

const baseURL = 'http://localhost:5000';

// Test data
const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123'
};

let receivedOTP = null;

// Helper function to make API calls
async function makeRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseURL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`\n${method} ${endpoint}:`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('Make sure the server is running on http://localhost:5000\n');

  // Test 1: Health check
  console.log('═'.repeat(50));
  console.log('TEST 1: Health Check');
  await makeRequest('/api/health');

  // Test 2: Send OTP
  console.log('\n═'.repeat(50));
  console.log('TEST 2: Send OTP');
  const otpResponse = await makeRequest('/api/auth/send-otp', 'POST', {
    email: testUser.email
  });

  if (otpResponse && otpResponse.success) {
    console.log('✅ OTP sent! Check your email.');
    console.log('📧 Enter the OTP code in your email to continue...');
    
    // Wait for user input (in real test, you'd parse the email)
    // For now, we'll skip verification
    console.log('\n⏭️  Skipping OTP verification (would require email parsing)');
  }

  // Note: Actual OTP verification requires receiving the email
  // In production, you would:
  // 1. Parse the email using a service like MailSlurp
  // 2. Or use a test SMTP service
  // 3. Or manually enter the OTP

  console.log('\n═'.repeat(50));
  console.log('✅ Basic tests complete!');
  console.log('\nTo test OTP verification:');
  console.log('1. Check your email for the OTP');
  console.log('2. Uncomment and run the verify-otp test below');
  console.log('3. Or manually test with:');
  console.log(`   curl -X POST http://localhost:5000/api/auth/verify-otp \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"email":"${testUser.email}","otp":"YOUR_OTP"}'`);
}

// Uncomment to test OTP verification (requires actual OTP from email)
/*
async function testOTPVerification() {
  console.log('═'.repeat(50));
  console.log('TEST 3: Verify OTP');
  console.log('Please enter the OTP from your email: ');
  
  // In a real script, you'd wait for input
  // For now, this is a placeholder
  const enteredOTP = '123456'; // Replace with actual OTP
  
  await makeRequest('/api/auth/verify-otp', 'POST', {
    email: testUser.email,
    otp: enteredOTP
  });
}

async function testSignup() {
  console.log('═'.repeat(50));
  console.log('TEST 4: Sign Up');
  console.log('Note: Requires verified OTP');
  
  await makeRequest('/api/auth/signup', 'POST', {
    name: testUser.name,
    email: testUser.email,
    password: testUser.password,
    otp: '123456' // Replace with verified OTP
  });
}

async function testSignin() {
  console.log('═'.repeat(50));
  console.log('TEST 5: Sign In');
  
  await makeRequest('/api/auth/signin', 'POST', {
    email: testUser.email,
    password: testUser.password
  });
}
*/

// Run the tests
runTests();

