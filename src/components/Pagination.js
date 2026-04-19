const Pagination = ({ page, totalPages, onChange }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-4 mt-8"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700" aria-live="polite">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        type="button"
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
