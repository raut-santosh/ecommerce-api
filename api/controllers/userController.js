const User = require('../models/User');
exports.createUser = (req, res, next) => {
    const { name, email, mobile, password, role, wishlist, addresses } = req.body;
    const user = new User({
        name,
        email,
        mobile,
        password,
        role,
        wishlist,
        addresses
    });
    
    user.save()
    .then(savedUser => {
        console.log(user);
            res.status(201).json({
                message: 'User created successfully',
                user: savedUser
            });
        })
        .catch(error => {
            res.status(500).json({
                error: 'An error occurred while creating the user.'
            });
        });
};

  
  exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find();
  
      res.status(200).json({
        users
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching the users.'
      });
    }
  };
  
  exports.getUserById = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      res.status(200).json({
        user
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while fetching the user.'
      });
    }
  };
  
  exports.updateUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const { name, email, mobile, password, role, wishlist, addresses } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          mobile,
          password,
          role,
          wishlist,
          addresses
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while updating the user.'
      });
    }
  };
  
  exports.deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndRemove(userId);
  
      if (!deletedUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while deleting the user.'
      });
    }
  };
  