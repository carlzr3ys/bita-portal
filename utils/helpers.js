const bcrypt = require('bcryptjs');

// Helper function to send JSON response
function sendJSONResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json(data);
}

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.includes('@student.utem.edu.my');
}

// Helper function to hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Helper function to verify password
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Extract batch from matric number
// Format: B032510017 -> Batch 2025 (positions 3-4 after "B03")
function extractBatchFromMatric(matric) {
  const matricUpper = matric.toUpperCase().trim();
  // Pattern: B03YYXXXXXX where YY is the batch year (last 2 digits)
  // Example: B032510017 -> 25 -> 2025
  const match = matricUpper.match(/^B03(\d{2})\d+$/);
  if (match) {
    const yearDigits = match[1];
    return '20' + yearDigits; // Convert 25 to 2025
  }
  return null;
}

// Generate session token
function generateSessionToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

module.exports = {
  sendJSONResponse,
  isValidEmail,
  hashPassword,
  verifyPassword,
  extractBatchFromMatric,
  generateSessionToken
};

