const Permission = require('../models/Permission');

exports.createPermission = async (req, res, next) => {
  try {
    if (req.body._id) {
      // Update an existing permission
      const updatedPermission = await Permission.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true } // Ensure you get the updated document as the response
      );

      if (!updatedPermission) {
        return res.status(404).json({ error: 'Permission not found' });
      }

      return res.status(200).json({ permission: updatedPermission });
    } else {
      // Create a new permission
      const { name, alias, category, description, scope } = req.body;
      const permission = new Permission({
        name,
        alias,
        category,
        description,
        scope
      });

      const savedPermission = await permission.save(); // Await the save operation

      return res.status(200).json({
        permission: savedPermission,
        message: 'Permission saved successfully'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'An error occurred while creating/updating the permission.'
    });
  }
};



exports.getPermissions = async (req, res, next) => {
  try {

    const list = await Permission.find().sort({ createdAt: -1 })

    const totalCount = await Permission.countDocuments(); // Get the total count of documents in the collection

    res.status(200).json({ list, totalCount });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the Roles.',
    });
  }
};

exports.getPermissionById = async (req, res, next) => {
  try{
    const permissionId = req.params.permissionId;
    let permission = await Permission.findById(permissionId);
    if(permission){
      return res.status(200).json({ permission : permission });
    }else{
      return res.status(403).json({message: 'Permission not found'});
    }
  }catch(error){
    res.status(500).json({message: "An error occurred while fetching the permission."});
  }
};


exports.deletePermission = async (req, res, next) => {
  try{
    const permissionId = req.params.permissionId;
    let permission = await Permission.findOneAndDelete(permissionId);
    if(permission){
      return res.status(200).json({permission: permission, message: 'Permission deleted successfully'});
    }else{
      return res.status(403).json({message: 'Permission not found'});
    }

  }catch(error){
    res.status(500).json({
      error: 'An error occurred while deleting the permission.'
    });
  }
};
