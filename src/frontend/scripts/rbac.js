// Role-based UI control utilities
class RBACManager {
  constructor() {
    this.currentUser = null;
    this.roles = null;
  }

  // Initialize RBAC with user data
  async initialize(user) {
    this.currentUser = user;

    // Fetch roles configuration
    try {
      const response = await fetch("/api/roles");
      this.roles = await response.json();
    } catch (error) {
      console.error("Failed to fetch roles configuration:", error);
      this.roles = null;
    }
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (!this.currentUser?.role || !this.roles) return false;
    return (
      this.roles[this.currentUser.role]?.permissions.includes(permission) ||
      false
    );
  }

  // Check if user has specific role
  hasRole(role) {
    if (!this.currentUser?.role || !this.roles) return false;
    if (this.currentUser.role === role) return true;
    return this.roles[this.currentUser.role]?.inherits?.includes(role) || false;
  }

  // Show/hide UI elements based on permissions
  applyPermissionBasedUI() {
    // Handle elements with data-requires-permission
    document
      .querySelectorAll("[data-requires-permission]")
      .forEach((element) => {
        const permission = element.dataset.requiresPermission;
        element.style.display = this.hasPermission(permission) ? "" : "none";
      });

    // Handle elements with data-requires-role
    document.querySelectorAll("[data-requires-role]").forEach((element) => {
      const role = element.dataset.requiresRole;
      element.style.display = this.hasRole(role) ? "" : "none";
    });
  }

  // Check if user can access a specific route
  canAccessRoute(route) {
    const routePermissions = {
      "/admin": ["manage_users"],
      "/characters/edit": ["edit_own_character"],
      "/characters/view": ["view_character"],
      "/equipment/manage": ["manage_equipment"],
      "/skills/manage": ["manage_skills"],
    };

    const requiredPermission = routePermissions[route];
    if (!requiredPermission) return true; // Public route
    return this.hasPermission(requiredPermission);
  }
}

// Create and export singleton instance
const rbacManager = new RBACManager();
export default rbacManager;

// Example usage in your app:
/*
// Initialize RBAC when user logs in
firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    await rbacManager.initialize(user);
    rbacManager.applyPermissionBasedUI();
  }
});

// Use in HTML:
<button data-requires-permission="manage_characters">Manage Characters</button>
<div data-requires-role="GAME_MASTER">Game Master Controls</div>
*/
