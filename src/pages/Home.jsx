import { Link } from 'react-router-dom';
import { getPosts } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { BlogCard } from '../components/BlogCard';

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
 * Authenticated blog list page component.
 * Displays all posts from localStorage in a responsive grid of BlogCard components,
 * sorted newest first. Shows a 'Write New Post' button. Renders an empty state with
 * a CTA if no posts exist. Includes the authenticated Navbar.
 * @returns {JSX.Element}
 */
export function Home() {
  const allPosts = getPosts();
  const sortedPosts = [...allPosts].sort(
    (a, b) => toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              All Posts
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Browse the latest posts from the community.
            </p>
          </div>
          <Link
            to="/write"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Write New Post
          </Link>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-neutral-400">
              No posts yet. Be the first to share something!
            </p>
            <Link
              to="/write"
              className="mt-4 inline-flex items-center px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;