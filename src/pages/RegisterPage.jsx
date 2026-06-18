import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

/**
 * Generates a UUID v4 string.
 * @returns {string} A UUID string.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Registration page component.
 * Renders a registration form with display name, username, password, and confirm password fields
 * on a gradient background. Validates all fields, checks password match, ensures unique username
 * (including reserved 'admin'). On success, creates user, saves to localStorage, sets session,
 * and redirects to /blogs. Already-authenticated users are redirected.
 * @returns {JSX.Element}
 */
export function RegisterPage() {
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

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword || !trimmedConfirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check reserved username
    if (trimmedUsername === 'admin') {
      setError('Username already exists.');
      return;
    }

    // Check existing users for duplicate username
    const users = getUsers();
    const existingUser = users.find((u) => u.username === trimmedUsername);
    if (existingUser) {
      setError('Username already exists.');
      return;
    }

    const newUser = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    setSession({
      userId: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    });

    navigate('/blogs', { replace: true });
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
            Create your account
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
                htmlFor="displayName"
                className="text-sm font-medium text-neutral-700"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

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
                placeholder="Choose a username"
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
                placeholder="Create a password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-neutral-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;