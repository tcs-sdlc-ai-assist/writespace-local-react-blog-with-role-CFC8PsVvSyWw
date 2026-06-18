import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { StatCard } from '../components/StatCard';
import { getAvatar } from '../components/Avatar';

/**
 * Converts an ISO date string to a timestamp for sorting.
 * @param {string} isoString - ISO date string.
 * @returns {number} Timestamp value.
 */
function toTimestamp(isoString) {
  try {
    return new Date(isoString).getTime();
  } catch {
    return 0;
  }
}

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
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Admin dashboard page component.
 * Displays a gradient welcome banner, stat cards for posts/users,
 * quick-action buttons, and a list of the 5 most recent posts with edit/delete actions.
 * Renders the authenticated Navbar. Non-admins are redirected via ProtectedRoute.
 * @returns {JSX.Element}
 */
export function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();

  const [posts, setPosts] = useState(() => getPosts());
  const users = getUsers();

  const sortedPosts = [...posts].sort(
    (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
  );
  const recentPosts = sortedPosts.slice(0, 5);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;

  const handleDelete = (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }

    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    setPosts(updatedPosts);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Gradient Header Banner */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Welcome back, {session.displayName}!
          </h1>
          <p className="mt-2 text-primary-100 text-sm sm:text-base">
            Here&apos;s an overview of your WriteSpace platform.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="📝" label="Total Posts" value={totalPosts} color="blue" />
          <StatCard icon="👥" label="Total Users" value={totalUsers} color="green" />
          <StatCard icon="👑" label="Admins" value={adminCount} color="purple" />
          <StatCard icon="📖" label="Users" value={userCount} color="orange" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            to="/write"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            ✍️ Write Post
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-neutral-700 text-sm font-medium border border-neutral-200 hover:bg-neutral-100 hover:text-primary-600 transition-colors"
          >
            👥 Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="rounded-lg bg-white shadow-sm border border-neutral-200 divide-y divide-neutral-200">
              {recentPosts.map((post) => {
                const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {getAvatar(authorRole)}
                      <div className="flex flex-col min-w-0">
                        <Link
                          to={`/blogs/${post.id}`}
                          className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors truncate"
                        >
                          {truncate(post.title, 60)}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-neutral-500">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-neutral-300">•</span>
                          <span className="text-xs text-neutral-400">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 ml-4 shrink-0">
                      <Link
                        to={`/edit/${post.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition-colors"
                        title="Edit post"
                      >
                        ✏️
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors"
                        title="Delete post"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-lg bg-white shadow-sm border border-neutral-200">
              <p className="text-lg text-neutral-400">
                No posts yet. Create the first one!
              </p>
              <Link
                to="/write"
                className="mt-4 inline-flex items-center px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;