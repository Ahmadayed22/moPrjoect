import { Search, SlidersHorizontal, X } from 'lucide-react'

function SearchFilterBar({ search, onSearchChange, fcFilter, onFcFilterChange, fcOptions, onClear }) {
  const hasFilters = search || fcFilter

  return (
    <section className="filter-bar">
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search hospital, person, or work order"
        />
      </label>
      <label className="select-field">
        <SlidersHorizontal size={18} aria-hidden="true" />
        <select value={fcFilter} onChange={(event) => onFcFilterChange(event.target.value)}>
          <option value="">All FC names</option>
          {fcOptions.map((fc) => (
            <option key={fc} value={fc}>
              {fc}
            </option>
          ))}
        </select>
      </label>
      <button className="clear-button" type="button" onClick={onClear} disabled={!hasFilters} title="Clear filters">
        <X size={18} aria-hidden="true" />
      </button>
    </section>
  )
}

export default SearchFilterBar
