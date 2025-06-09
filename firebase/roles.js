// Role definitions for the Infinity Game Dashboard
const ROLES = {
  ADMIN: {
    name: "admin",
    permissions: [
      "manage_users",
      "manage_characters",
      "manage_skills",
      "manage_equipment",
      "view_analytics",
    ],
    description: "Full system access",
  },
  GAME_MASTER: {
    name: "game_master",
    permissions: [
      "manage_characters",
      "manage_skills",
      "manage_equipment",
      "view_analytics",
    ],
    description: "Can manage game content and view analytics",
  },
  PLAYER: {
    name: "player",
    permissions: [
      "view_character",
      "edit_own_character",
      "view_skills",
      "view_equipment",
    ],
    description: "Can view and manage their own character",
  },
  VIEWER: {
    name: "viewer",
    permissions: ["view_character", "view_skills", "view_equipment"],
    description: "Can only view character information",
  },
};

// Permission checking helper
const hasPermission = (userRole, permission) => {
  return ROLES[userRole]?.permissions.includes(permission) || false;
};

// Role hierarchy
const ROLE_HIERARCHY = {
  ADMIN: ["GAME_MASTER", "PLAYER", "VIEWER"],
  GAME_MASTER: ["PLAYER", "VIEWER"],
  PLAYER: ["VIEWER"],
  VIEWER: [],
};

// Check if role has access (including hierarchy)
const hasRole = (userRole, requiredRole) => {
  if (userRole === requiredRole) return true;
  return ROLE_HIERARCHY[userRole]?.includes(requiredRole) || false;
};

module.exports = {
  ROLES,
  hasPermission,
  hasRole,
  ROLE_HIERARCHY,
};
