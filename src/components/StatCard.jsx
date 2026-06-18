import PropTypes from 'prop-types';

/**
 * Reusable stat display card for admin dashboard.
 * Displays a number and label with a colorful icon background.
 * @param {Object} props
 * @param {string} props.icon - Emoji or text to display as the icon.
 * @param {string} props.label - Descriptive label for the stat.
 * @param {number|string} props.value - The stat value to display.
 * @param {'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'} [props.color='blue'] - Color scheme for the icon background.
 * @returns {JSX.Element}
 */
const colorMap = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export function StatCard({ icon, label, value, color = 'blue' }) {
  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm border border-neutral-200">
      <span
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-semibold ${colorClasses}`}
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        <span className="text-sm text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red', 'indigo']),
};

export default StatCard;