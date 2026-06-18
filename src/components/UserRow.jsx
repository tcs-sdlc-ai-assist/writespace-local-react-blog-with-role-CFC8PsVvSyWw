import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} isoString - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Role badge pill component.
 * @param {Object} props
 * @param {'admin' | 'user'} props.role - The role to display.
 * @returns {JSX.Element}
 */
function RoleBadge({ role }) {
  const classes =
    role === 'admin'
      ? 'bg-violet-100 text-violet-700'
      : 'bg-indigo-100 text-indigo-700';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {role}
    </span>
  );
}

RoleBadge.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

/**
 * Reusable user display row/card for admin user management.
 * Renders as a table row on desktop and a stacked card on mobile.
 * Shows avatar, display name, username, role badge pill, created date, and delete button.
 * Delete button is disabled for the hard-coded admin account and for self-deletion prevention.
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.userId - Unique user ID.
 * @param {string} props.user.username - Username.
 * @param {string} props.user.displayName - Display name.
 * @param {'admin' | 'user'} props.user.role - User role.
 * @param {string} [props.user.createdAt] - ISO date string of account creation.
 * @param {string} props.currentUserId - The currently logged-in user's ID.
 * @param {function} props.onDelete - Callback invoked with userId when delete is clicked.
 * @returns {JSX.Element}
 */
export function UserRow({ user, currentUserId, onDelete }) {
  const isHardCodedAdmin = user.userId === 'admin';
  const isSelf = user.userId === currentUserId;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  let deleteTitle = 'Delete user';
  if (isHardCodedAdmin) {
    deleteTitle = 'Cannot delete the default admin account';
  } else if (isSelf) {
    deleteTitle = 'Cannot delete your own account';
  }

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900">
                {user.displayName}
              </span>
              <span className="text-xs text-neutral-400">@{user.username}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <RoleBadge role={user.role} />
        </td>
        <td className="px-4 py-3 text-sm text-neutral-500">
          {user.createdAt ? formatDate(user.createdAt) : '—'}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            onClick={() => onDelete(user.userId)}
            disabled={deleteDisabled}
            title={deleteTitle}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              deleteDisabled
                ? 'text-neutral-300 cursor-not-allowed'
                : 'text-red-500 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            🗑️
          </button>
        </td>
      </tr>

      {/* Mobile card */}
      <div className="md:hidden rounded-lg bg-white shadow-sm border border-neutral-200 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {getAvatar(user.role)}
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-neutral-900">
              {user.displayName}
            </span>
            <span className="text-xs text-neutral-400">@{user.username}</span>
          </div>
          <RoleBadge role={user.role} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            {user.createdAt ? formatDate(user.createdAt) : '—'}
          </span>
          <button
            type="button"
            onClick={() => onDelete(user.userId)}
            disabled={deleteDisabled}
            title={deleteTitle}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              deleteDisabled
                ? 'text-neutral-300 cursor-not-allowed'
                : 'text-red-500 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            🗑️
          </button>
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;