const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'geoguard.alerts@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password'
  }
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'geoguard.alerts@gmail.com',
      to: email,
      subject: 'GeoGuard - Your OTP for Login',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a3a52 0%, #00a8e8 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">GeoGuard</h1>
            <p style="margin: 5px 0 0 0;">Flood Risk Prediction System</p>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1a3a52; margin-top: 0;">Your One-Time Password</h2>
            <p style="color: #666; font-size: 16px;">Your OTP for login is:</p>
            <div style="background: white; border: 2px solid #00a8e8; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <h1 style="color: #00a8e8; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
          </div>
          <div style="background: #1a3a52; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">GeoGuard - Transforming Disaster Alerts into Actionable Intelligence</p>
          </div>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const createSessionToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '30d' }
  );
};

const verifySessionToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateOTP,
  generateSessionToken,
  sendOTPEmail,
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken
};
