import { useState, useMemo } from 'react';
import { 
  HiOutlineXMark, 
  HiOutlineDocumentText, 
  HiOutlineCheckCircle, 
  HiOutlineMinusCircle,
  HiOutlineCheck,
  HiOutlineMagnifyingGlass
} from 'react-icons/hi2';
import './DownloadModal.css';

export default function DownloadModal({ isOpen, onClose, jobs, onDownload }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds(filteredJobs.map(job => job.id));
  };

  const handleClearAll = () => {
    setSelectedIds([]);
  };

  const handleDownload = () => {
    const selectedJobs = jobs.filter(job => selectedIds.includes(job.id));
    onDownload(selectedJobs);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="download-modal">
        <header className="modal__header">
          <div className="modal__header-title">
            <HiOutlineDocumentText className="modal__header-icon" />
            <h2 className="modal__title">Export Applications</h2>
          </div>
          <button className="modal__close" onClick={onClose}>
            <HiOutlineXMark />
          </button>
        </header>

        <div className="download-modal__content">
          <p className="download-modal__desc">
            Select the job applications you want to include in your PDF report.
          </p>

          <div className="download-modal__toolbar">
            <div className="download-modal__search">
              <HiOutlineMagnifyingGlass className="download-modal__search-icon" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="download-modal__search-input"
              />
            </div>
            <div className="download-modal__controls">
              <button 
                className="download-modal__control-btn" 
                onClick={handleSelectAll}
                type="button"
              >
                <HiOutlineCheckCircle /> Select All
              </button>
              <button 
                className="download-modal__control-btn" 
                onClick={handleClearAll}
                type="button"
              >
                <HiOutlineMinusCircle /> Clear
              </button>
            </div>
          </div>

          <div className="download-modal__list">
            {filteredJobs.length === 0 ? (
              <div className="download-modal__empty">No jobs found</div>
            ) : (
              filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className={`download-item ${selectedIds.includes(job.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelect(job.id)}
                >
                  <div className="download-item__checkbox">
                    {selectedIds.includes(job.id) && <HiOutlineCheck />}
                  </div>
                  <div className="download-item__info">
                    <span className="download-item__company">{job.company}</span>
                    <span className="download-item__role">{job.role}</span>
                  </div>
                  <div className={`download-item__status status--${job.status.toLowerCase()}`}>
                    {job.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="download-modal__footer">
          <div className="download-modal__stat">
            {selectedIds.length} job{selectedIds.length !== 1 ? 's' : ''} selected
          </div>
          <div className="modal__actions">
            <button className="modal__btn modal__btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="modal__btn modal__btn--primary" 
              onClick={handleDownload}
              disabled={selectedIds.length === 0}
            >
              Export PDF
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
