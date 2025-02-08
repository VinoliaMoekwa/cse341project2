
const isAuthenticated = (req, res, next) => {
    console.log("In isAuthenticated middleware. req.user:", req.user);
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "You do not have access" });
  };
  
  module.exports = { isAuthenticated };
  
 
