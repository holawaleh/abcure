function Pagination({ page, hasNext, hasPrevious, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
      >
        Previous
      </button>
      <span className="text-sm text-gray-500">Page {page}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;