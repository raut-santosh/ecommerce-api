const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.createRole = (req, res, next) => {
  const { name, alias, permissions } = req.body;

  const role = new Role({
    name,
    alias,
    permissions
  });

  role.save()
    .then(savedRole => {
      res.status(201).json({
        message: 'Role created successfully',
        role: savedRole
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while creating the role.'
      });
    });
};

exports.getRoles = (req, res, next) => {
  Role.find()
    .then(roles => {
      res.status(200).json({
        roles
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while fetching the roles.'
      });
    });
};

exports.getRoleById = (req, res, next) => {
  const roleId = req.params.roleId;

  Role.findById(roleId)
    .then(role => {
      if (!role) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
      res.status(200).json({
        role
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while fetching the role.'
      });
    });
};

exports.updateRole = (req, res, next) => {
  const roleId = req.params.roleId;
  const { name, permissions } = req.body;

  Role.findByIdAndUpdate(
    roleId,
    {
      name,
      alias,
      permissions
    },
    { new: true }
  )
    .then(updatedRole => {
      if (!updatedRole) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
      res.status(200).json({
        message: 'Role updated successfully',
        role: updatedRole
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while updating the role.'
      });
    });
};

exports.deleteRole = (req, res, next) => {
  const roleId = req.params.roleId;

  Role.findByIdAndRemove(roleId)
    .then(deletedRole => {
      if (!deletedRole) {
        return res.status(404).json({
          message: 'Role not found'
        });
      }
      res.status(200).json({
        message: 'Role deleted successfully'
      });
    })
    .catch(error => {
      res.status(500).json({
        error: 'An error occurred while deleting the role.'
      });
    });
};
