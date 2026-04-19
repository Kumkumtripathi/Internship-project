import {
  HiOutlineSquares2X2,
  HiOutlineDocumentDuplicate,
  HiOutlineChartPie,
  HiOutlineCog6Tooth,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle
} from 'react-icons/hi2';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose, activeSection, onSectionChange, userName, onLogout }) {
  const sections = [
    { slug: 'dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
    { slug: 'applications', label: 'Applications', icon: HiOutlineDocumentDuplicate },
  ];

  const tools = [
    { slug: 'analytics', label: 'Analytics', icon: HiOutlineChartPie },
    { slug: 'settings', label: 'Settings', icon: HiOutlineCog6Tooth },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">J</div>
        <h1 className="sidebar__title">JobPulse</h1>
        <button className="sidebar__close-btn" onClick={onClose} aria-label="Close sidebar">
          <HiOutlineXMark />
        </button>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section">
          <h2 className="sidebar__section-title">MAIN</h2>
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button 
                key={s.slug} 
                className={`sidebar__link ${activeSection === s.slug ? 'sidebar__link--active' : ''}`}
                onClick={() => onSectionChange(s.slug)}
              >
                <Icon className="sidebar__icon" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar__section">
          <h2 className="sidebar__section-title">TOOLS</h2>
          {tools.map(s => {
            const Icon = s.icon;
            return (
              <button 
                key={s.slug} 
                className={`sidebar__link ${activeSection === s.slug ? 'sidebar__link--active' : ''}`}
                onClick={() => onSectionChange(s.slug)}
              >
                <Icon className="sidebar...icon" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <HiOutlineUserCircle className="sidebar__user-icon" />
          <span className="sidebar__user-name" title={userName}>{userName}</span>
        </div>
        <button className="sidebar__logout-btn" onClick={onLogout} title="Sign Out">
          <HiOutlineArrowRightOnRectangle />
        </button>
      </div>
    </aside>
  );
}
