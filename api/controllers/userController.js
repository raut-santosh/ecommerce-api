const User = require('../models/User');
const Address = require('../models/Address');

exports.addeditUser = async (req, res, next) => {
  try {
    const { _id, name, email, mobile, password, role, addresses } = req.body;

    // Function to handle address creation/update
    async function handleAddresses(addressData) {
      const updatedAddresses = [];
      for (const address of addressData) {
        if (address._id) {
          // If address has an _id, update it
          const updatedAddress = await Address.findOneAndUpdate(
            { _id: address._id },
            { $set: address },
            { new: true }
          );
          updatedAddresses.push(updatedAddress);
        } else {
          // If address doesn't have an _id, create a new one
          const tempAddress = new Address(address);
          await tempAddress.save();
          updatedAddresses.push(tempAddress);
        }
      }
      return updatedAddresses;
    }

    // Check if _id is provided for user
    if (_id) {
      // Update existing user
      const updatedAddresses = await handleAddresses(addresses);

      const user = await User.findOneAndUpdate(
        { _id },
        {
          $set: {
            name,
            email,
            mobile,
            password,
            role,
            addresses: updatedAddresses.map((address) => address._id),
          },
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user, message: 'User updated successfully' });
    } else {
      // Create a new user
      if (!addresses || addresses.length === 0) {
        return res.status(400).json({ message: 'Please provide at least one address' });
      }

      const newAddresses = await handleAddresses(addresses);

      const user = new User({
        name,
        email,
        mobile,
        password,
        role,
        addresses: newAddresses.map((address) => address._id),
      });

      await user.save();

      return res.status(200).json({ user, message: 'User created successfully' });
    }
  } catch (error) {
    console.error(error);
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
    console.log(typeof req.query.searchbyrole)
    if (req.query.searchbyrole !== 'null' && req.query.searchbyrole !== undefined) {
      const roleId = req.query.searchbyrole;
      conditionarray.push({ role: roleId });
    }
    
    
    const query = { $and: conditionarray };
    const list = await User.find(query).populate('role').populate('addresses').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
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
      const user = await User.findById(userId).populate('role').populate('addresses');
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
  