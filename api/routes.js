const fileController = require('./controllers/fileController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const roleController = require('./controllers/roleController');
const permissionsController = require('./controllers/permissionsController');

module.exports = function (app) {
    // Handling cors errors (middleware)
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });

        // Default route
    app.get('/', (req, res, next) => {
        res.status(200).json({'msg':'hello world!'});
    });

    // Route for uploading files
    app.post('/upload/file', fileController.uploadFile);

    // Route for creating a new product
    app.post('/products', productController.createProduct);

    // Route for getting all products
    app.get('/products', productController.getAllProducts);

    // Route for getting a specific product by ID
    app.get('/products/:productId', productController.getProductById);

    app.delete('/products/:productId', productController.deleteProduct);

    // Route for creating a new user
    app.post('/users', userController.createUser);

    // Route for getting all users
    app.get('/users', userController.getAllUsers);

    // Route for getting a specific user by ID
    app.get('/users/:userId', userController.getUserById);

    // Route for updating a user by ID
    app.put('/users/:userId', userController.updateUser);

    // Route for deleting a user by ID
    app.delete('/users/:userId', userController.deleteUser);

    app.post('/roles', roleController.createRole);
    app.get('/roles', roleController.getRoles);
    app.get('/roles/:roleId', roleController.getRoleById);
    app.put('/roles/:roleId', roleController.updateRole);
    app.delete('/roles/:roleId', roleController.deleteRole);

    // Route for creating a new permission
    app.post('/permissions', permissionsController.createPermission);

    // Route for getting all permissions
    app.get('/permissions', permissionsController.getPermissions);

    // Route for getting a specific permission by ID
    app.get('/permissions/:permissionId', permissionsController.getPermissionById);

    // Route for updating a permission by ID
    app.patch('/permissions/:permissionId', permissionsController.updatePermission);

    // Route for deleting a permission by ID
    app.delete('/permissions/:permissionId', permissionsController.deletePermission);

}
