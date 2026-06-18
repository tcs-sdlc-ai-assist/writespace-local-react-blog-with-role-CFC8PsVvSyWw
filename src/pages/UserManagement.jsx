import { useState } from 'react';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { UserRow } from '../components/UserRow';

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
 * Admin user management page component.
 * Displays a create user form at the top with display name, username, password, and role fields.
 * Validates all fields and checks username uniqueness (including reserved 'admin').
 * Below the form, renders all users (including the hard-coded admin) via UserRow components.
 * Delete with confirmation dialog. Hard-coded admin cannot be deleted.
 * Logged-in admin cannot delete their own account. Renders the authenticated Navbar.
 * @returns {JSX.Element}
 */
export function UserManagement() {
  const session = getSession();

  const [users, setUsers] = useState(() => getUsers());

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    // Check reserved username
    if (trimmedUsername === 'admin') {
      setError('Username already exists.');
      return;
    }

    // Check existing users for duplicate username
    const currentUsers = getUsers();
    const existingUser = currentUsers.find((u) => u.username === trimmedUsername);
    if (existingUser) {
      setError('Username already exists.');
      return;
    }

    const newUser = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    currentUsers.push(newUser);
    saveUsers(currentUsers);
    setUsers(currentUsers);

    // Reset form
    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${trimmedDisplayName}" created successfully.`);
  };

  const handleDelete = (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) {
      return;
    }

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== userId && u.userId !== userId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setSuccess('User deleted successfully.');
  };

  if (!session) {
    return null;
  }

  // Build the full user list including the hard-coded admin
  const hardCodedAdmin = {
    userId: 'admin',
    username: 'admin',
    displayName: 'Admin',
    role: 'admin',
    createdAt: undefined,
  };

  const allUsers = [
    hardCodedAdmin,
    ...users.map((u) => ({
      userId: u.id,
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create and manage platform users.
          </p>
        </div>

        {/* Create User Form */}
        <div className="rounded-lg bg-white shadow-sm border border-neutral-200 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">
            Create New User
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  placeholder="Enter display name"
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
                  htmlFor="role"
                  className="text-sm font-medium text-neutral-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block rounded-lg bg-white shadow-sm border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <UserRow
                        key={user.userId}
                        user={user}
                        currentUserId={session.userId}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.userId}
                    user={user}
                    currentUserId={session.userId}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 rounded-lg bg-white shadow-sm border border-neutral-200">
              <p className="text-lg text-neutral-400">
                No users found. Create the first one above!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;