const fileController = require('./controllers/fileController');
const productController = require('./controllers/productController');

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

}
