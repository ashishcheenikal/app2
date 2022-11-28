const jwt = require("jsonwebtoken");

exports.authRoute = async (req, res, next) => {
  try {
    let tmp = req.headers.authorization;
    const token = JSON.parse(tmp ? tmp.slice(7, tmp.length) : "")
    if (!token) {
      return res.status(400).json({ message: "Invalid Authentification no token" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Authentification token error" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
