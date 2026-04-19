const EmptyState = ({ query }) => (
  <div className="text-center py-16" role="status">
    <p className="text-lg text-gray-600">
      {query ? `No results for "${query}".` : "No articles available right now."}
    </p>
    <p className="text-sm text-gray-500 mt-2">Try a different search or category.</p>
  </div>
);

export default EmptyState;
