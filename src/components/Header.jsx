import {
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineBars3,
  HiOutlineArrowDownTray
} from 'react-icons/hi2';
import { STATUSES } from '../hooks/useJobs';
import './Header.css';

export default function Header({
  onAddClick,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExportClick,
  onToggleSidebar,
  minimal = false,
}) {
  const location = window.location.pathname;
  
  const getPageTitle = () => {
    if (location.includes('analytics')) return 'Analytics';
    if (location.includes('settings')) return 'Settings';
    if (location.includes('applications')) return 'Applications';
    return 'Dashboard';
  };

  return (
    <header className={`header ${minimal ? 'header--minimal' : ''}`} id="app-header">
      <div className="header__inner">
        <div className="header__brand-mobile">
          <button className="header__menu-btn" onClick={onToggleSidebar}>
            <HiOutlineBars3 />
          </button>
          <h1 className="header__title">{getPageTitle()}</h1>
        </div>

        {!minimal && (
          <div className="header__actions">
            {/* Search */}
            <div className="header__search">
              <HiOutlineMagnifyingGlass className="header__search-icon" />
              <input
                type="text"
                placeholder="Search company, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header__search-input"
              />
            </div>

            {/* Filters */}
            <div className="header__filters">
              <button
                className={`header__filter-pill ${statusFilter === 'All' ? 'active' : ''}`}
                onClick={() => setStatusFilter('All')}
              >
                All
              </button>
              {STATUSES.map((status) => (
                <button
                  key={status}
                  className={`header__filter-pill ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Export & Add Job */}
            <div className="header__button-group">
              <button className="header__export-btn" title="Export PDF" onClick={onExportClick}>
                <HiOutlineArrowDownTray />
              </button>
              <button className="header__add-btn" onClick={onAddClick}>
                <HiOutlinePlus />
                <span>Add Job</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
