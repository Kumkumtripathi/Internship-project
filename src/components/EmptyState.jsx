import { HiOutlinePlusCircle, HiOutlineRocketLaunch } from 'react-icons/hi2';
import './EmptyState.css';

export default function EmptyState({ onAddClick }) {
  return (
    <div className="empty-state" id="empty-state">
      <div className="empty-state__inner">
        <div className="empty-state__icon-ring">
          <div className="empty-state__icon">
            <HiOutlineRocketLaunch />
          </div>
        </div>
        <h2 className="empty-state__title">Start Tracking Your Job Applications</h2>
        <p className="empty-state__text">
          Track applications, monitor progress, and stay organized.
        </p>
        <button className="empty-state__btn" onClick={onAddClick}>
          <HiOutlinePlusCircle />
          <span>Add Job</span>
        </button>
      </div>
    </div>
  );
}
