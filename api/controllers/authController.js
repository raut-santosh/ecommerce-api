const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

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
    
    const defaultRole = await Role.findOne({ name: 'Customer' }); // Fetch the default role from database
    console.log('control is here')
    if (!defaultRole) {
      return res.status(500).json({
        error: 'Default role not found'
      });
    }
    console.log(defaultRole);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: defaultRole._id // Assign the default role's ID
    });

    user.save().then((savedUser) => {
      res.status(201).json({
        message: 'User registered successfully',
        user: savedUser
      });
    }).catch((err) => {
      res.status(500).json({
        error: `Error registering user: ${err.message}`
      });
    });
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while registering the user: ${error.message}`
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .populate('role') // Populate the role reference
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({
            error: 'Authentication failed',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              userId: user._id,
              email: user.email,
              role: user.role.name, // Use the name of the role
            },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRY,
            }
          );
          return res.status(200).json({
            message: 'Authentication successful',
            token: token,
          });
        } else {
          return res.status(401).json({
            message: 'Authentication failed',
          });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while processing your request.',
      });
    });
};



exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extracted from the token
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


