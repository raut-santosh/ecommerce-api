const File = require('../models/File');
const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Middleware to handle file uploads
const uploadMiddleware = upload.single('file');

// Controller to upload a file and associate with a provided alias
exports.uploadFile = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        error: 'An error occurred while uploading the file.'
      });
    }

    try {
        console.log(req.body);
      const { originalname, path, mimetype, size } = req.file;
      const { alias } = req.body; // Alias sent from the frontend

      const file = new File({
        name: originalname,
        alias: alias, // Store the alias in the database
        path,
        type: mimetype,
        size,
        is_active: true,
      });

      const savedFile = await file.save();

      res.status(201).json({
        message: 'File added successfully',
        file: savedFile
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while uploading the file.'
      });
    }
  });
};
