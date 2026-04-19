import JobCard from './JobCard';
import { STATUSES } from '../hooks/useJobs';
import './JobPipeline.css';

export default function JobPipeline({ jobs, onDelete, onStatusChange, onEdit }) {
  // Group jobs by status
  const groupedJobs = STATUSES.reduce((acc, status) => {
    acc[status] = jobs.filter(j => j.status === status);
    return acc;
  }, {});

  return (
    <div className="job-pipeline">
      {STATUSES.map(status => (
        <div key={status} className="pipeline-column">
          <div className="pipeline-column__header">
            <h3 className="pipeline-column__title">{status}</h3>
            <span className="pipeline-column__count">{groupedJobs[status].length}</span>
          </div>
          <div className="pipeline-column__cards">
            {groupedJobs[status].map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                index={i}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
              />
            ))}
            {groupedJobs[status].length === 0 && (
              <div className="pipeline-column__empty">No jobs</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
