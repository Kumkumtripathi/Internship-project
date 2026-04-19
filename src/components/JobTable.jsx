import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import './JobTable.css';

const STATUS_CONFIG = {
  Applied: { class: 'status--applied' },
  Interview: { class: 'status--interview' },
  Offer: { class: 'status--offer' },
  Rejected: { class: 'status--rejected' },
};

export default function JobTable({ jobs, onDelete, onEdit }) {
  return (
    <div className="job-table-wrapper">
      <table className="job-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Location</th>
            <th>Date</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td className="font-medium text-white">{job.company}</td>
              <td className="text-secondary">{job.role}</td>
              <td>
                <span className={`table-status-badge ${STATUS_CONFIG[job.status]?.class || ''}`}>
                  {job.status}
                </span>
              </td>
              <td className="text-secondary">{job.location || '—'}</td>
              <td className="text-secondary">{new Date(job.date).toLocaleDateString()}</td>
              <td className="text-right">
                <button className="table-action-btn" onClick={() => onEdit(job)} title="Edit">
                  <HiOutlinePencilSquare />
                </button>
                <button className="table-action-btn hover-danger" onClick={() => onDelete(job.id)} title="Delete">
                  <HiOutlineTrash />
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
             <tr>
               <td colSpan="6" className="text-center py-6 text-tertiary">No applications found.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
