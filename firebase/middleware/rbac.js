const admin = require("firebase-admin");
const { hasPermission, hasRole } = require("../roles");

// Middleware to verify Firebase token and attach user role
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || "VIEWER", // Default to viewer if no role set
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to check for specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: "Permission denied" });
    }

    next();
  };
};

// Middleware to check for specific roles
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!hasRole(req.user.role, role)) {
      return res.status(403).json({ error: "Role access denied" });
    }

    next();
  };
};

// Middleware to check if user is accessing their own resource
const requireOwnership = (resourceIdPath) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get the resource ID from the specified path in the request
    const resourceId = resourceIdPath
      .split(".")
      .reduce((obj, key) => obj[key], req);

    // If user is admin or game master, allow access
    if (hasRole(req.user.role, "GAME_MASTER")) {
      return next();
    }

    // For players, check if they own the resource
    if (resourceId !== req.user.uid) {
      return res.status(403).json({ error: "Access denied to resource" });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  requirePermission,
  requireRole,
  requireOwnership,
};
