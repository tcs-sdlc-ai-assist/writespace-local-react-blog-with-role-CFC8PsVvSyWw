import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard component that protects routes based on authentication and role.
 * @param {Object} props
 * @param {'admin'} [props.role] - Optional role requirement. If 'admin', only admin users can access.
 * @param {React.ReactNode} props.children - Child components to render if authorized.
 * @returns {JSX.Element} The children if authorized, or a Navigate redirect.
 */
export function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  role: PropTypes.oneOf(['admin']),
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;