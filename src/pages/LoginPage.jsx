import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

/**
 * Login page component.
 * Renders a login form with username and password fields on a gradient background.
 * Authenticates against hard-coded admin credentials first, then localStorage users.
 * Redirects authenticated users to their appropriate home page.
 * @returns {JSX.Element}
 */
export function LoginPage() {
  const navigate = useNavigate();
  const session = getSession();

  // Redirect already-authenticated users
  if (session) {
    if (session.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/blogs', { replace: true });
    }
    return null;
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Username and password are required.');
      return;
    }

    // Check hard-coded admin credentials first
    if (trimmedUsername === 'admin' && trimmedPassword === 'admin') {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      navigate('/admin', { replace: true });
      return;
    }

    // Check localStorage users
    const users = getUsers();
    const user = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );

    if (!user) {
      setError('Invalid username or password.');
      return;
    }

    setSession({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });

    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/blogs', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-white tracking-tight hover:text-primary-100 transition-colors"
          >
            WriteSpace
          </Link>
          <p className="mt-2 text-primary-100 text-sm">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-lg bg-white shadow-lg border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-neutral-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;