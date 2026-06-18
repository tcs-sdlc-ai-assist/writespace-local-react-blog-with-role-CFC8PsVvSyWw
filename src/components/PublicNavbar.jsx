import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Public/guest navigation bar component.
 * Shows 'WriteSpace' logo on left.
 * For guests: 'Login' and 'Get Started' buttons on right.
 * For authenticated users: avatar chip and 'Go to Dashboard' button.
 * @returns {JSX.Element}
 */
export function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors tracking-tight"
        >
          WriteSpace
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="flex items-center gap-2">
                {getAvatar(session.role)}
                <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                  {session.displayName}
                </span>
              </div>
              <Link
                to={session.role === 'admin' ? '/admin' : '/blogs'}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;