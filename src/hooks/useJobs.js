import { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Each user gets their own storage key: jobpulse_jobs_{userId}
const getStorageKey = (userId) => `jobpulse_jobs_${userId}`;

const loadFromStorage = (userId) => {
  if (!userId) return [];
  try {
    const data = localStorage.getItem(getStorageKey(userId));
    if (data) return JSON.parse(data);
    return []; // New user starts with empty list
  } catch {
    return [];
  }
};

const saveToStorage = (userId, jobs) => {
  if (!userId) return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function useJobs(userId) {
  const [jobs, setJobs] = useState(() => loadFromStorage(userId));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Reload jobs when userId changes (login/logout)
  useEffect(() => {
    setJobs(loadFromStorage(userId));
    setSearchQuery('');
    setStatusFilter('All');
    setSortBy('date-desc');
  }, [userId]);

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(userId, jobs);
  }, [userId, jobs]);

  // Add a new job
  const addJob = useCallback((jobData) => {
    const newJob = {
      id: uuidv4(),
      company: jobData.company.trim(),
      role: jobData.role.trim(),
      status: jobData.status || 'Applied',
      date: jobData.date || new Date().toISOString().split('T')[0],
      location: jobData.location?.trim() || '',
      notes: jobData.notes?.trim() || '',
      nextStepDate: jobData.nextStepDate || '',
      createdAt: Date.now(),
    };
    setJobs((prev) => [newJob, ...prev]);
  }, []);

  // Delete a job
  const deleteJob = useCallback((id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  // Update a job's status
  const updateJobStatus = useCallback((id, newStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  }, []);

  // Update a whole job
  const updateJob = useCallback((id, updatedData) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? {
              ...job,
              ...updatedData,
              company: updatedData.company.trim(),
              role: updatedData.role.trim(),
              location: updatedData.location?.trim() || '',
              notes: updatedData.notes?.trim() || '',
            }
          : job
      )
    );
  }, []);

  // Filtered + searched + sorted list
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    if (statusFilter !== 'All') {
      result = result.filter((job) => job.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(q) ||
          job.role.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'date-desc':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [jobs, searchQuery, statusFilter, sortBy]);

  // Dashboard stats
  const stats = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter((j) => j.status === 'Applied').length;
    const interviews = jobs.filter((j) => j.status === 'Interview').length;
    const offers = jobs.filter((j) => j.status === 'Offer').length;
    const rejected = jobs.filter((j) => j.status === 'Rejected').length;
    const successRate = total > 0 ? Math.round((interviews / total) * 100) : 0;

    const chartBars = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let appliedThisWeek = 0;
    let appliedPrevWeek = 0;
    let offersThisWeek = 0;

    jobs.forEach((job) => {
      const d = new Date(job.date);
      d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

      const diffTime = today - d;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 7) {
        chartBars[6 - diffDays] += 1;
        appliedThisWeek += 1;
        if (job.status === 'Offer') offersThisWeek += 1;
      } else if (diffDays >= 7 && diffDays < 14) {
        appliedPrevWeek += 1;
      }
    });

    const thisWeekVariance = appliedThisWeek - appliedPrevWeek;

    return {
      total, applied, interviews, offers, rejected, successRate,
      appliedThisWeek, appliedPrevWeek, thisWeekVariance, offersThisWeek, chartBars,
    };
  }, [jobs]);

  return {
    jobs: filteredJobs,
    allJobs: jobs,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    addJob,
    deleteJob,
    updateJobStatus,
    updateJob,
  };
}
