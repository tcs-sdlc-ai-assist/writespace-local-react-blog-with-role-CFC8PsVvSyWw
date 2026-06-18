import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * Shows 'WriteSpace' logo, role-based nav links, avatar chip with display name,
 * logout dropdown, and mobile hamburger toggle.
 * @returns {JSX.Element}
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    clearSession();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  if (!session) {
    return null;
  }

  const isAdmin = session.role === 'admin';

  const navLinks = isAdmin
    ? [
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'Users' },
        { to: '/blogs', label: 'Blogs' },
        { to: '/write', label: 'Write' },
      ]
    : [
        { to: '/blogs', label: 'Blogs' },
        { to: '/write', label: 'Write' },
      ];

  return (
    <nav className="w-full bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors tracking-tight"
          >
            WriteSpace
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Avatar chip with dropdown - desktop */}
          <div className="hidden md:block relative">
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-neutral-700">
                {session.displayName}
              </span>
              <span className="text-xs text-neutral-400">▼</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-neutral-200 py-1 z-50">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-neutral-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-neutral-700">
                {session.displayName}
              </span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;