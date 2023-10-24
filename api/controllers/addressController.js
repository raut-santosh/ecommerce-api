const Address = require('../models/Address');

exports.addEditAddress = async (req, res) => {
    try {
        if (req.body._id) {
            let address = await Address.findOneAndUpdate({ _id: req.body._id }, req.body);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            } else {
                return res.status(200).json({ message: 'Address updated successfully', address: address });
            }
        } else {
            const {
                customerName,
                contactNo,
                addressLine,
                locality,
                city,
                state,
                postalCode,
                country = 'India', // Default value if not provided
                label,
                latitude,
                longitude,
                mapAddress,
                createdBy,
                isDefault = false, // Default value if not provided
            } = req.body;

            const address = new Address({
                customerName,
                contactNo,
                addressLine,
                locality,
                city,
                state,
                postalCode,
                country,
                label,
                latitude,
                longitude,
                mapAddress,
                isDefault,
                createdBy
            });

            address.save();
            if (address) {
                res.status(200).json({ address: address, message: 'Address added successfully' });
            }
        }


    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while creating the address.'
        });
    }
}

exports.getAddressList = async (req, res) => {
    try {
        const { offset = 0, limit = process.env.PAGINATION_LIMIT, search } = req.query;
        const skip = parseInt(offset) * parseInt(limit);

        // Create a filter to support searching
        const filter = {};
        if (search && search !== 'undefined') {
            filter.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { contactNo: { $regex: search, $options: 'i' } },
                { addressLine: { $regex: search, $options: 'i' } },
                { locality: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
                { postalCode: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } },
                { label: { $regex: search, $options: 'i' } },
            ];
        }

        // Query the products collection with search and pagination
        const data = await Address.find(filter)
            .populate('createdBy')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // Get the total count of documents that match the search criteria
        const totalCount = await Address.countDocuments(filter);

        res.status(200).json({ data, totalCount });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching the addresses.',
        });
    }
}

exports.getAddressById = async (req, res, next) => {
    try {
        const addressId = req.params.addressId;
        const address = await Address.findById(addressId).populate('createdBy');
        if (!address) {
            return res.status(404).json({
                message: 'Address not found'
            });
        }
        res.status(200).json({
            address
        });
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while fetching the address.'
        });
    }
};


exports.deleteAddress = async (req, res) => {
    try {
      const addressId = req.params.addressId;
      const deletedAddress = await Address.findByIdAndRemove(addressId);
      
      if (!deletedAddress) {
        return res.status(404).json({
          message: 'Address not found'
        });
      }
  
      res.status(200).json({
        message: 'Address deleted successfully',
        address: deletedAddress
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while deleting the address.'
      });
    }
  };