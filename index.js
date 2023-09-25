const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer"); // Add multer import
const app = express();
require('dotenv').config()

mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connected to the online database");
  })
  .catch((e) => {
    console.log("Error: ", e);
  })

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Import your route setup
const routes = require("./api/routes")(app);

// File upload endpoint using multer
app.post("/upload", multer().single("file"), (req, res) => {
  // Handle file upload here
  res.status(201).json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
