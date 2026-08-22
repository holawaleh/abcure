const TRADITIONS = [
  { value: '', label: 'All' },
  { value: 'herbal', label: 'Herbal' },
  { value: 'christian', label: 'Christian' },
  { value: 'islamic', label: 'Islamic' },
  { value: 'general', label: 'General' },
];

function FilterBar({ activeTradition, onTraditionChange, searchTerm, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
      <div className="flex flex-wrap gap-2">
        {TRADITIONS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTraditionChange(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTradition === t.value
                ? 'bg-brand-dark text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search products…"
        className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}

export default FilterBar;