const SESSION_KEY = 'writespace_session';

/**
 * Retrieves the current session from localStorage.
 * @returns {Object|null} Session object with userId, username, displayName, role, or null if no session.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data === null) {
      return null;
    }
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error reading session from localStorage:', error);
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {Object} session - Session object containing userId, username, displayName, and role.
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }
}

/**
 * Removes the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session from localStorage:', error);
  }
}