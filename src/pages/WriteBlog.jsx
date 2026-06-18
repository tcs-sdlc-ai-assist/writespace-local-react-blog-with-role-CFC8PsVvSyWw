import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
import { Navbar } from '../components/Navbar';

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

const TITLE_MAX_LENGTH = 200;
const CONTENT_MAX_LENGTH = 10000;

/**
 * Blog creation and editing page component.
 * Supports create mode ('/write') and edit mode ('/edit/:id').
 * In edit mode, loads post from localStorage and enforces ownership:
 * users can only edit their own posts, admin can edit any.
 * Title and content fields with validation and character counter.
 * On save, writes to localStorage and redirects to post view.
 * Cancel button returns to previous page. Renders Navbar.
 * @returns {JSX.Element}
 */
export function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const posts = getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
      setError('Post not found.');
      setLoading(false);
      return;
    }

    // Enforce ownership: users can only edit their own posts, admin can edit any
    if (session && session.role !== 'admin' && post.authorId !== session.userId) {
      setError('You do not have permission to edit this post.');
      setLoading(false);
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setLoading(false);
  }, [id, isEditMode, session]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less.`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setError(`Content must be ${CONTENT_MAX_LENGTH} characters or less.`);
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const postIndex = posts.findIndex((p) => p.id === id);

      if (postIndex === -1) {
        setError('Post not found.');
        return;
      }

      // Re-check ownership at save time
      if (session && session.role !== 'admin' && posts[postIndex].authorId !== session.userId) {
        setError('You do not have permission to edit this post.');
        return;
      }

      posts[postIndex] = {
        ...posts[postIndex],
        title: trimmedTitle,
        content: trimmedContent,
        updatedAt: new Date().toISOString(),
      };

      savePosts(posts);
      navigate(`/blogs/${id}`, { replace: true });
    } else {
      const newPost = {
        id: generateId(),
        title: trimmedTitle,
        content: trimmedContent,
        authorId: session.userId,
        authorName: session.displayName,
        createdAt: new Date().toISOString(),
      };

      posts.push(newPost);
      savePosts(posts);
      navigate(`/blogs/${newPost.id}`, { replace: true });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {isEditMode ? 'Edit Post' : 'Write New Post'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isEditMode
              ? 'Update your post below.'
              : 'Share your thoughts with the community.'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg text-neutral-400">Loading…</p>
          </div>
        ) : error && (isEditMode && (error === 'Post not found.' || error === 'You do not have permission to edit this post.')) ? (
          <div className="text-center py-16">
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 inline-block">
              {error}
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
              >
                Back to Blogs
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white shadow-sm border border-neutral-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Title
                  </label>
                  <span
                    className={`text-xs ${
                      title.trim().length > TITLE_MAX_LENGTH
                        ? 'text-red-500'
                        : 'text-neutral-400'
                    }`}
                  >
                    {title.trim().length}/{TITLE_MAX_LENGTH}
                  </span>
                </div>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium text-neutral-700"
                  >
                    Content
                  </label>
                  <span
                    className={`text-xs ${
                      content.trim().length > CONTENT_MAX_LENGTH
                        ? 'text-red-500'
                        : 'text-neutral-400'
                    }`}
                  >
                    {content.trim().length}/{CONTENT_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here…"
                  rows={12}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  {isEditMode ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default WriteBlog;