import JobCard from './JobCard';
import EmptyState from './EmptyState';
import { HiOutlinePlus } from 'react-icons/hi2';
import './JobList.css';

export default function JobList({ jobs, onDelete, onStatusChange, onEdit, onAddClick, title = "Recent Applications" }) {

  if (jobs.length === 0) {
    return <EmptyState onAddClick={onAddClick} />;
  }

  return (
    <section className="job-list" id="job-list-section" aria-label="Job applications">
      <div className="job-list__header">
        <h2 className="job-list__title">{title}</h2>
      </div>
      
      <div className="job-list__grid">
        {jobs.map((job, i) => (
          <JobCard
            key={job.id}
            job={job}
            index={i}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
          />
        ))}

        <div className="job-add-card" onClick={onAddClick}>
          <div className="job-add-card__inner">
            <HiOutlinePlus className="job-add-card__icon" />
            <span>Add new application</span>
          </div>
        </div>
      </div>
    </section>
  );
}
