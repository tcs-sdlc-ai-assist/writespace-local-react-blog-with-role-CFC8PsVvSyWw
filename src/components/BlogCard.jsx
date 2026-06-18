import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

const borderColors = [
  'border-t-blue-500',
  'border-t-green-500',
  'border-t-purple-500',
  'border-t-orange-500',
  'border-t-red-500',
  'border-t-indigo-500',
];

/**
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} Truncated text.
 */
function truncate(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
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
 * Reusable blog post card component for list views.
 * Displays title, excerpt, formatted date, author with avatar, and optional edit link.
 * @param {Object} props
 * @param {Object} props.post - The post object.
 * @param {string} props.post.id - Unique post ID.
 * @param {string} props.post.title - Post title.
 * @param {string} props.post.content - Full post content.
 * @param {string} props.post.createdAt - ISO date string.
 * @param {string} props.post.authorId - Author's user ID.
 * @param {string} props.post.authorName - Author's display name.
 * @param {number} [props.index=0] - Index for cycling border color.
 * @returns {JSX.Element}
 */
export function BlogCard({ post, index = 0 }) {
  const session = getSession();
  const borderColor = borderColors[index % borderColors.length];
  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`rounded-lg bg-white shadow-sm border border-neutral-200 border-t-4 ${borderColor} flex flex-col`}
    >
      <div className="p-6 flex flex-col flex-1">
        <Link
          to={`/blogs/${post.id}`}
          className="text-lg font-bold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
        >
          {post.title}
        </Link>
        <p className="mt-2 text-sm text-neutral-600 flex-1">
          {truncate(post.content, 150)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          {canEdit && (
            <Link
              to={`/edit/${post.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-primary-600 transition-colors"
              title="Edit post"
            >
              ✏️
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number,
};

export default BlogCard;