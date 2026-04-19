import {
  HiOutlineMagnifyingGlass,
  HiOutlineFunnel,
  HiOutlineArrowsUpDown,
} from 'react-icons/hi2';
import { STATUSES } from '../hooks/useJobs';
import './FilterBar.css';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  jobCount,
}) {
  return (
    <section className="filter-bar" id="filter-section">
      <div className="filter-bar__inner">
        {/* Search */}
        <div className="filter-bar__search">
          <HiOutlineMagnifyingGlass className="filter-bar__search-icon" />
          <input
            id="search-input"
            type="text"
            placeholder="Search company, role, location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-bar__search-input"
          />
          {searchQuery && (
            <button
              className="filter-bar__clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Pills */}
        <div className="filter-bar__pills">
          <HiOutlineFunnel className="filter-bar__pills-icon" />
          <button
            className={`filter-pill ${statusFilter === 'All' ? 'filter-pill--active' : ''}`}
            onClick={() => setStatusFilter('All')}
          >
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`filter-pill filter-pill--${status.toLowerCase()} ${
                statusFilter === status ? 'filter-pill--active' : ''
              }`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sort + Count */}
        <div className="filter-bar__meta">
          <div className="filter-bar__sort">
            <HiOutlineArrowsUpDown />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-bar__sort-select"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="company">Company A–Z</option>
            </select>
          </div>
          <span className="filter-bar__count mono">
            {jobCount} result{jobCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </section>
  );
}
