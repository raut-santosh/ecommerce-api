const User = require('../models/User');

exports.addeditUser = async (req, res, next) => {
  try {
    if (req.body._id) {
      const user = await User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ user, message: 'User updated successfully' });
    } else {
      const { name, email, mobile, password, role } = req.body;
      const user = new User({
        name,
        email,
        mobile,
        password,
        role,
      });
      await user.save(); // Make sure to await the save operation
      return res.status(200).json({ user, message: 'User created successfully' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      error: 'An error occurred while creating/updating the user.',
    });
  }
};


  
exports.getAllUsers = async (req, res, next) => {
  try {
    const { offset = 0, limit = process.env.PAGINATION_LIMIT } = req.query;
    const skip = parseInt(offset) * parseInt(limit);
    let conditionarray = [{}];
    if(req.query.searchbyrole){
      const roleId = req.query.searchbyrole;
      conditionarray.push({ role: roleId });
    }
    const query = { $and: conditionarray };
    const list = await User.find(query).populate('role').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const totalCount = await User.countDocuments(query);

    if (list.length === 0) { 
      return res.status(200).json({ message: 'No users found' });
    }

    res.status(200).json({
      list,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while fetching the users.',
    });
  }
};

  
  exports.getUserById = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('role');
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
      console.log('working')

      if (!deletedUser) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
  
      res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while deleting the user.'
      });
    }
  };
  