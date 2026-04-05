const EmptyState = ({
  icon = "🔍",
  title,
  description,
}: {
  icon?: string;
  title: string;
  description?: string;
}) => (
  <div className="text-center py-16 text-gray-400 dark:text-gray-500">
    <p className="text-3xl mb-2">{icon}</p>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    {description && (
      <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">{description}</p>
    )}
  </div>
);

export default EmptyState;