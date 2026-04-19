import { useState, useEffect, useRef } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { STATUSES } from '../hooks/useJobs';
import './AddJobModal.css';

const INITIAL_FORM = {
  company: '',
  role: '',
  status: 'Applied',
  date: new Date().toISOString().split('T')[0],
  location: '',
  notes: '',
  nextStepDate: '',
};

export default function AddJobModal({ isOpen, onClose, onSave, editingJob }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [shake, setShake] = useState(false);
  const companyRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        setForm({
          company: editingJob.company || '',
          role: editingJob.role || '',
          status: editingJob.status || 'Applied',
          date: editingJob.date || new Date().toISOString().split('T')[0],
          location: editingJob.location || '',
          notes: editingJob.notes || '',
          nextStepDate: editingJob.nextStepDate || '',
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setTimeout(() => companyRef.current?.focus(), 100);
    }
  }, [isOpen, editingJob]);

  // Close on Escape & Prevent Scroll
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handler);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      id="add-job-modal-overlay"
    >
      <div className={`modal ${shake ? 'modal--shake' : ''}`} id="add-job-modal">
        <div className="modal__header">
          <h2 className="modal__title">{editingJob ? 'Edit Application' : 'Add Application'}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            <HiOutlineXMark />
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {/* Company */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-company">
              Company <span className="form-required">*</span>
            </label>
            <input
              id="input-company"
              ref={companyRef}
              type="text"
              className="form-input"
              placeholder="e.g. Google"
              value={form.company}
              onChange={handleChange('company')}
            />
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-role">
              Role <span className="form-required">*</span>
            </label>
            <input
              id="input-role"
              type="text"
              className="form-input"
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={handleChange('role')}
            />
          </div>

          {/* Status + Date row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="input-status">Status</label>
              <select
                id="input-status"
                className="form-input form-select"
                value={form.status}
                onChange={handleChange('status')}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-date">Date Applied</label>
              <input
                id="input-date"
                type="date"
                className="form-input"
                value={form.date}
                onChange={handleChange('date')}
              />
            </div>
          </div>

          {/* Location + Next Step Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="input-location">
                Location <span className="form-optional">(optional)</span>
              </label>
              <input
                id="input-location"
                type="text"
                className="form-input"
                placeholder="e.g. SF, CA / Remote"
                value={form.location}
                onChange={handleChange('location')}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-next-step">
                Follow-up Date <span className="form-optional">(optional)</span>
              </label>
              <input
                id="input-next-step"
                type="date"
                className="form-input"
                value={form.nextStepDate}
                onChange={handleChange('nextStepDate')}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label" htmlFor="input-notes">
              Notes <span className="form-optional">(optional)</span>
            </label>
            <textarea
              id="input-notes"
              className="form-input form-textarea"
              placeholder="Any notes about this application…"
              rows={3}
              value={form.notes}
              onChange={handleChange('notes')}
            />
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__btn modal__btn--primary" id="submit-job-btn">
              {editingJob ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
