const EmptyState = ({ query }) => (
  <div className="text-center py-16" role="status">
    <p className="text-lg text-[color:var(--mfe-muted,#475569)]">
      {query ? `No results for "${query}".` : "No articles available right now."}
    </p>
    <p className="text-sm text-[color:var(--mfe-muted,#475569)] mt-2">Try a different search or category.</p>
  </div>
);

export default EmptyState;
