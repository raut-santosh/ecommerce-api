const fileController = require('./controllers/fileController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');
const roleController = require('./controllers/roleController');
const permissionsController = require('./controllers/permissionsController');
const orderController = require('./controllers/orderController');
const reviewController = require('./controllers/reviewController');
const authController = require('./controllers/authController');
const authenticate = require('./middlewares/authentication');
const mailer = require('./middlewares/mailer');

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


    app.post('/register', authController.register);

    // Log in
    app.post('/login', authController.login);
    
    // Refresh access token
    
    // Change password
    app.post('/change-password/:userId', authenticate, authController.changePassword);

    // Route for uploading files
    app.post('/upload/file', authenticate, fileController.uploadFile);

    // Route for creating a new product
    app.post('/products/addedit', authenticate, productController.createProduct);

    // Route for getting all products
    app.get('/products/list', productController.getAllProducts);

    // Route for getting a specific product by ID
    app.get('/products/addedit/:productId', productController.getProductById);

    app.delete('/products/delete/:productId',authenticate, productController.deleteProduct);

    // Route for creating a new user
    app.post('/user/addedit', userController.createUser);

    // Route for getting all users
    app.get('/users/list', userController.getAllUsers);

    // Route for getting a specific user by ID
    app.get('/user/:userId', userController.getUserById);

    // Route for updating a user by ID
    // app.put('/users/:userId', authenticate, userController.updateUser);

    // Route for deleting a user by ID
    app.delete('/user/:userId', userController.deleteUser);

    app.post('/role/addedit', roleController.addedit);
    app.get('/roles/list', roleController.getRoles);
    app.get('/role/:roleId', roleController.getRoleById);
    // app.put('/role/:roleId', roleController.updateRole);
    app.delete('/role/:roleId', roleController.deleteRole);

    // Route for creating a new permission
    app.post('/permissions/addedit', permissionsController.createPermission);

    // Route for getting all permissions
    app.get('/permissions/list', permissionsController.getPermissions);

    // Route for getting a specific permission by ID
    app.get('/permissions/:permissionId', permissionsController.getPermissionById);

    // Route for updating a permission by ID
    // app.patch('/permissions/:permissionId', authenticate, permissionsController.updatePermission);

    // Route for deleting a permission by ID
    app.delete('/permissions/:permissionId', permissionsController.deletePermission);

    // Route for creating a new order
    app.post('/orders/addedit', authenticate, orderController.createOrder);

    // Route for getting all orders
    app.get('/orders/list', authenticate, orderController.getAllOrders);

    // Route for getting a specific order by ID
    app.get('/orders/:orderId', authenticate, orderController.getOrderById);

    // Route for updating order status
    app.patch('/orders/:orderId/status', authenticate, orderController.updateOrderStatus);

    // Route for deleting an order
    app.delete('/orders/:orderId', orderController.deleteOrder);

    // Create a new review
    app.post('/reviews/addedit', authenticate, reviewController.createReview);

    // Get all reviews
    app.get('/reviews/list', reviewController.getAllReviews);

    // Get a specific review by ID
    app.get('/reviews/:reviewId', reviewController.getReviewById);

    // Update a review
    app.put('/reviews/:reviewId', authenticate, reviewController.updateReview);

    // Delete a review
    app.delete('/reviews/:reviewId', authenticate, reviewController.deleteReview);

}
