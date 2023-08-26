const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if user with the same email or mobile exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with the same email or mobile already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: 'Customer' // Default role
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: savedUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while registering the user.'
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed'
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      accessToken,
      refreshToken,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while logging in.'
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.userData.userId; // Extracted from the token
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        error: 'Incorrect old password'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while changing the password.'
    });
  }
};

const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  });
};
