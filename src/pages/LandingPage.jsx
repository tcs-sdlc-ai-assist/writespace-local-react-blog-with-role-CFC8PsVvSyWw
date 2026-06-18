import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { PublicNavbar } from '../components/PublicNavbar';
import { BlogCard } from '../components/BlogCard';

/**
 * Formats an ISO date string for sorting purposes.
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
 * Public landing page component.
 * Renders hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
export function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt))
    .slice(0, 3);

  const features = [
    {
      icon: '✍️',
      title: 'Write Freely',
      description:
        'Create and publish your thoughts with a clean, distraction-free writing experience.',
    },
    {
      icon: '👥',
      title: 'Role-Based Access',
      description:
        'Manage your platform with admin and user roles, each with tailored permissions and views.',
    },
    {
      icon: '⚡',
      title: 'Instant & Local',
      description:
        'No server needed. Your data is stored locally in the browser for instant performance.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            WriteSpace
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-primary-100">
            A modern writing platform where ideas come to life. Share your stories, manage your content, and connect with readers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-primary-700 text-base font-semibold hover:bg-primary-50 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white text-white text-base font-semibold hover:bg-white hover:text-primary-700 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">
            Why WriteSpace?
          </h2>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Everything you need to start writing and sharing your ideas with the world.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg bg-white p-8 shadow-sm border border-neutral-200 text-center flex flex-col items-center"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-2xl mb-4">
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
              Discover what our community has been writing about.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-lg">
                No posts yet. Be the first to write something!
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-lg font-bold text-white tracking-tight">
                WriteSpace
              </span>
              <p className="mt-1 text-sm text-neutral-500">
                A modern writing platform.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-neutral-800 pt-8 text-center">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;