
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Ensure correct path
// const authenticateUser = (req, res, next) => {


//   const authHeader = req.header("Authorization");
//   console.log("Authorization Header:", authHeader); // Debugging step

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("Extracted Token:", token); // Debugging step

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Debugging step

//     req.user = decoded; // Store the user in `req.user`
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// module.exports = authenticateUser;

// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Ensure correct path

// const authenticateUser = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   console.log("Authorization Header:", authHeader); // Debugging

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("Extracted Token:", token); // Debugging

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Debugging

//     req.user = await User.findById(decoded.userId).select("-password");
//     console.log("Authenticated User:", req.user); // Debugging

//     if (!req.user) {
//       return res.status(401).json({ error: "User not found" });
//     }
//     console.log("Authenticated User (Middleware):", req.user);
//     next();
//   } catch (error) {
//     console.error("Token Verification Failed:", error);
//     res.status(401).json({ error: "Invalid token" });
//   }
// };


const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // Debugging

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    const user = await User.findById(decoded.userId).select("-password");
    console.log("Authenticated User:", user); // Debugging

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    console.log("Authenticated User (Middleware):", req.user);
    next();
  } catch (error) {
    console.error("Token Verification Failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authenticateUser;


