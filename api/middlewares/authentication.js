const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = decoded;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Your not logged in",
    });
  }
};