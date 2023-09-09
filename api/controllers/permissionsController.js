const Permission = require('../models/Permission');

exports.createPermission = (req, res, next) => {
  const { name, alias, category, description, scope } = req.body;

  const permission = new Permission({
    name,
    alias,
    category,
    description,
    scope
  });

  permission.save()
    .then(savedPermission => {
      res.status(201).json({
        message: 'Permission created successfully',
        permission: savedPermission
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while creating the permission.'
      });
    });
};

exports.getPermissions = async (req, res, next) => {
  try {

    const list = await Permission.find().sort({ createdAt: -1 })

    const totalCount = await Permission.countDocuments(); // Get the total count of documents in the collection

    res.status(200).json({ list, totalCount });
  } catch (error) {
    console.error('Error fetching Permissions:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the Roles.',
    });
  }
};

exports.getPermissionById = (req, res, next) => {
  const permissionId = req.params.permissionId;

  Permission.findById(permissionId)
    .then(permission => {
      if (!permission) {
        return res.status(404).json({
          message: 'Permission not found'
        });
      }
      res.status(200).json({
        permission
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while fetching the permission.'
      });
    });
};

exports.updatePermission = (req, res, next) => {
  const permissionId = req.params.permissionId;
  const { name, alias, category, description, scope } = req.body;

  Permission.findByIdAndUpdate(
    permissionId,
    {
      name,
      alias,
      category,
      description,
      scope
    },
    { new: true }
  )
    .then(updatedPermission => {
      if (!updatedPermission) {
        return res.status(404).json({
          message: 'Permission not found'
        });
      }
      res.status(200).json({
        message: 'Permission updated successfully',
        permission: updatedPermission
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while updating the permission.'
      });
    });
};

exports.deletePermission = (req, res, next) => {
  const permissionId = req.params.permissionId;

  Permission.findByIdAndRemove(permissionId)
    .then(deletedPermission => {
      if (!deletedPermission) {
        return res.status(404).json({
          message: 'Permission not found'
        });
      }
      res.status(200).json({
        message: 'Permission deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while deleting the permission.'
      });
    });
};
