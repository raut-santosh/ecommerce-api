const fileController = require('./controllers/fileController');


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

    app.get('/', (req, res, next) => {
        res.status(200).json({'msg':'hello world!'});
    })

    app.post('/upload/file', fileController.uploadFile);
    // app.post('/upload/file', upload.single('file'), fileController.uploadFile);
}