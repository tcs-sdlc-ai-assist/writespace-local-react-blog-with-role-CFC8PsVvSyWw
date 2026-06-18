import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import { Navbar } from '../components/Navbar';
import { getAvatar } from '../components/Avatar';

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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Single blog post reading page component.
 * Displays full post content with title, author avatar, formatted date, and body.
 * Admin users see edit/delete buttons on all posts.
 * Regular users see edit/delete only on their own posts (authorId matches session userId).
 * Delete confirms via window.confirm before removal and redirects to '/blogs'.
 * Handles invalid/missing IDs with 'Post not found' message.
 * Renders the authenticated Navbar.
 * @returns {JSX.Element}
 */
export function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) {
      return;
    }

    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.id !== id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  };

  const authorRole = post ? (post.authorId === 'admin' ? 'admin' : 'user') : 'user';

  const canEditOrDelete =
    session &&
    post &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {notFound ? (
          <div className="text-center py-16">
            <p className="text-lg text-neutral-400">Post not found.</p>
            <Link
              to="/blogs"
              className="mt-4 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        ) : post ? (
          <article>
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                {post.title}
              </h1>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getAvatar(authorRole)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-800">
                      {post.authorName}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>

                {canEditOrDelete && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/edit/${post.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="Edit post"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete post"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white shadow-sm border border-neutral-200 p-6 sm:p-8">
              <div className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/blogs"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                ← Back to Blogs
              </Link>
            </div>
          </article>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-neutral-400">Loading…</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReadBlog;