const Role = require('../models/Role');
const Permission = require('../models/Permission');

exports.addedit = async (req, res, next) => {
  try{
    if(req.body._id){
      let role = await Role.findOneAndUpdate({_id:req.body._id},req.body);
      return res.status(200).json({role:role})
    }else{
      const { name, alias, permissions } = req.body;
      const role = new Role({
        name,
        alias,
        permissions
      });
      role.save();
      return res.status(200).json({role: role, message: 'Role created successfully'});
    }
  }catch(error){
    res.status(500).json({
      error: 'An error occurred while creating the role.'
    });
  }
};

exports.getRoles =  async(req, res, next) => {
  try {
    const { offset = 0, limit = process.env.PAGINATION_LIMIT } = req.query;

    const skip = parseInt(offset) * parseInt(limit);

    const list = await Role.find()
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('permissions');

    const totalCount = await Role.countDocuments(); // Get the total count of documents in the collection

    res.status(200).json({ list, totalCount });
  } catch (error) {
    console.error('Error fetching Roles:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the Roles.',
    });
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const roleId = req.params.roleId;
    const role = await Role.findOne({ _id: roleId });

    if (role) {
      res.status(200).json({ role });
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the role.'
    });
  }
  
};


exports.deleteRole = async (req, res, next) => {
  try{
    console.log('Deleting')
    const roleId = req.params.roleId;
    let role = await Role.findOneAndDelete({_id: roleId});
    res.status(200).json({role: role, message: "Role deleted successfully"});
  }catch(error){
    res.status(500).json({
      error: 'An error occurred while deleting the role.'
    });
  }
};
