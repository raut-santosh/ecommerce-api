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

// Middleware to handle file uploads (updated to allow multiple files)
const uploadMiddleware = upload.array('files', 5); // Allow up to 5 files

// Controller to upload multiple files and associate them with provided aliases
exports.uploadFiles = async (req, res, next) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        error: 'An error occurred while uploading the files.'
      });
    }

    try {
      const filesData = [];

      for (const uploadedFile of req.files) {
        const { originalname, path, mimetype, size } = uploadedFile;
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
        filesData.push(savedFile);
      }

      res.status(201).json({
        files: filesData
      });
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while uploading the files.'
      });
    }
  });
};
