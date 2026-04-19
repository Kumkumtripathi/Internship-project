import { useState, useEffect, useRef } from 'react';
import {
  HiOutlineTrash,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { STATUSES } from '../hooks/useJobs';
import './JobCard.css';

const STATUS_CONFIG = {
  Applied: { class: 'status--applied' },
  Interview: { class: 'status--interview' },
  Offer: { class: 'status--offer' },
  Rejected: { class: 'status--rejected' },
};

function getInitials(company) {
  return company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getInitialColor(company) {
  const colors = [
    '#5b7cfa', '#9b6dff', '#2ec48a', '#e69a30',
    '#e8675a', '#38a8d8', '#d97d3a', '#8b7ad4',
  ];
  let hash = 0;
  for (const ch of company) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function JobCard({ job, onDelete, onStatusChange, onEdit, index }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const statusRef = useRef(null);
  const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.Applied;
  const initials = getInitials(job.company);
  const bgColor = getInitialColor(job.company);

  const formattedDate = new Date(job.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Click-outside handler for status dropdown
  useEffect(() => {
    if (!showStatusMenu) return;
    const handler = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showStatusMenu]);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(job.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      className="job-card"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
      id={`job-card-${job.id}`}
    >
      {/* Top Row: Avatar & Status */}
      <div className="job-card__top">
        <div className="job-card__avatar" style={{ backgroundColor: `${bgColor}18`, color: bgColor }}>
          {initials}
        </div>
        <div className="job-card__status-wrapper" ref={statusRef}>
          <button
            className={`job-card__status-badge ${config.class}`}
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            aria-label="Change status"
          >
            <span>{job.status}</span>
          </button>
          {showStatusMenu && (
            <div className="job-card__status-menu">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  className={`job-card__status-option ${STATUS_CONFIG[s].class} ${
                    s === job.status ? 'job-card__status-option--current' : ''
                  }`}
                  onClick={() => {
                    onStatusChange(job.id, s);
                    setShowStatusMenu(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Company & Role */}
      <div className="job-card__middle">
        <h3 className="job-card__company">{job.company}</h3>
        <p className="job-card__role">{job.role}</p>
      </div>

      <div className="job-card__divider" />

      {/* Bottom Row: Meta */}
      <div className="job-card__bottom">
        <span className="job-card__meta-item">
          <HiOutlineCalendarDays />
          {formattedDate}
        </span>
        {job.location && (
          <span className="job-card__meta-item">
            <HiOutlineMapPin />
            {job.location}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="job-card__actions">
        <button
          className="job-card__btn job-card__btn--edit"
          onClick={() => onEdit(job)}
          aria-label={`Edit ${job.company} application`}
        >
          <HiOutlinePencilSquare />
        </button>
        <button
          className={`job-card__btn ${showDeleteConfirm ? 'job-card__btn--confirm-delete' : 'job-card__btn--delete'}`}
          onClick={handleDelete}
          aria-label={showDeleteConfirm ? 'Confirm delete' : `Delete ${job.company} application`}
          title={showDeleteConfirm ? 'Click again to confirm' : 'Delete'}
        >
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
}
