// Storage
export { saveToken, getToken, clearToken } from './storage.js';

// Utils
export {
  decodeToken,
  encodeToken,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  isCurrentUserAdmin,
  canAccessOrder,
  canModifyOrder,
  canDeleteOrder,
  canCreateOrder,
  canAssignOrderTo,
} from './utils.js';

// Fetch
export { fetchWithAuth, fetchJson } from './fetch.js';
