import PropTypes from 'prop-types';

/**
 * Returns a styled JSX avatar element based on the user's role.
 * @param {'admin' | 'user'} role - The role of the user.
 * @returns {JSX.Element} A styled span element with an emoji and role-specific background color.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-based avatar.
 * @param {Object} props
 * @param {'admin' | 'user'} props.role - The role of the user.
 * @returns {JSX.Element}
 */
export function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;