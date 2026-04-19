import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useJobs from './hooks/useJobs';
import AuthPage from './components/AuthPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import JobList from './components/JobList';
import BottomDash from './components/BottomDash';
import AddJobModal from './components/AddJobModal';
import DownloadModal from './components/DownloadModal';
import Toast from './components/Toast';
import { generatePDF } from './utils/pdfGenerator';
import { HiOutlineArrowsUpDown, HiOutlineExclamationTriangle } from 'react-icons/hi2';
import './App.css';

// ── Auth Guard: Redirect to login if not authenticated ──
function AuthGuard({ children, isLoggedIn }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

// ── Guest Guard: Redirect to dashboard if already authenticated ──
function GuestGuard({ children, isLoggedIn }) {
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { currentUser, isLoggedIn, signup, login, logout, updatePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    jobs,
    allJobs,
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
  } = useJobs(currentUser?.id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // ── Reset filters on section change ──
  useEffect(() => {
    setSearchQuery('');
    setStatusFilter('All');
    setSortBy('date-desc');
  }, [location.pathname]);

  const activeSection = useMemo(() => {
    const path = location.pathname.substring(1);
    return path || 'dashboard';
  }, [location.pathname]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingJob(null), 300);
  };

  const handleAddOrEdit = (jobData) => {
    if (editingJob) {
      updateJob(editingJob.id, jobData);
      showToast('Job updated successfully');
    } else {
      addJob(jobData);
      showToast('Job added successfully');
    }
  };

  const handleDelete = (id) => {
    deleteJob(id);
    showToast('Job deleted');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }
    const res = updatePassword(newPassword.trim());
    if (res.success) {
      showToast('Password updated');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast(res.error || 'Update failed');
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (deleteConfirmText.trim().toLowerCase() !== 'delete') return;
    
    const res = deleteAccount();
    if (res.success) {
      navigate('/login');
    } else {
      showToast(res.error || 'Deletion failed');
    }
  };

  // ── Export Logic ──
  const handleExportClick = () => {
    setIsDownloadModalOpen(true);
  };

  const handleDownloadSelected = (selectedJobs) => {
    generatePDF(selectedJobs, currentUser);
    showToast(`${selectedJobs.length} apps exported to PDF`);
  };

  const handleFullExport = () => {
    if (allJobs.length === 0) {
      showToast('No jobs to export');
      return;
    }
    generatePDF(allJobs, currentUser);
    showToast('Full data exported to PDF');
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your job data? This cannot be undone.')) {
      localStorage.removeItem(`jobpulse_jobs_${currentUser.id}`);
      window.location.reload();
    }
  };

  const handleSectionChange = (slug) => {
    navigate(`/${slug}`);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const showHeader = ['/dashboard', '/applications', '/'].includes(location.pathname);

  return (
    <div className="app" id="app-root">
      {isLoggedIn && (
        <>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            userName={currentUser.name}
            onLogout={handleLogout}
          />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
        </>
      )}
      
      <div className={`app__content ${!isLoggedIn ? 'app__content--full' : ''}`}>
        {isLoggedIn && (
          <Header 
            onAddClick={openModal} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onExportClick={handleExportClick}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            minimal={!showHeader}
          />
        )}

        <main className="app__main">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={
              <GuestGuard isLoggedIn={isLoggedIn}>
                <AuthPage 
                  onLogin={(e, p) => {
                    const res = login(e, p);
                    if (res.success) navigate('/dashboard');
                    return res;
                  }} 
                  onSignup={(n, e, p) => {
                    const res = signup(n, e, p);
                    if (res.success) navigate('/dashboard');
                    return res;
                  }} 
                  initialMode="login"
                />
              </GuestGuard>
            } />
            <Route path="/signup" element={
              <GuestGuard isLoggedIn={isLoggedIn}>
                <AuthPage 
                  onLogin={(e, p) => {
                    const res = login(e, p);
                    if (res.success) navigate('/dashboard');
                    return res;
                  }} 
                  onSignup={(n, e, p) => {
                    const res = signup(n, e, p);
                    if (res.success) navigate('/dashboard');
                    return res;
                  }} 
                  initialMode="signup"
                />
              </GuestGuard>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <AuthGuard isLoggedIn={isLoggedIn}>
                <>
                  <StatsBar stats={stats} />
                  <JobList
                    jobs={jobs.slice(0, 5)}
                    onDelete={handleDelete}
                    onStatusChange={updateJobStatus}
                    onEdit={(job) => {
                      setEditingJob(job);
                      openModal();
                    }}
                    onAddClick={openModal}
                    title="Recent Applications"
                  />
                  <BottomDash stats={stats} />
                </>
              </AuthGuard>
            } />

            <Route path="/applications" element={
              <AuthGuard isLoggedIn={isLoggedIn}>
                <>
                  <div className="applications-toolbar">
                    <h2 className="section-title">All Applications</h2>
                    <div className="sort-control">
                      <HiOutlineArrowsUpDown className="sort-control__icon" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-control__select"
                      >
                        <option value="date-desc">Newest first</option>
                        <option value="date-asc">Oldest first</option>
                        <option value="company">Company A–Z</option>
                      </select>
                      <span className="sort-control__count">{jobs.length} result{jobs.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <JobList
                    jobs={jobs}
                    onDelete={handleDelete}
                    onStatusChange={updateJobStatus}
                    onEdit={(job) => {
                      setEditingJob(job);
                      openModal();
                    }}
                    onAddClick={openModal}
                    title=""
                  />
                </>
              </AuthGuard>
            } />

            <Route path="/analytics" element={
              <AuthGuard isLoggedIn={isLoggedIn}>
                <>
                  <StatsBar stats={stats} />
                  <BottomDash stats={stats} />
                </>
              </AuthGuard>
            } />

            <Route path="/settings" element={
              <AuthGuard isLoggedIn={isLoggedIn}>
                <div className="settings-page">
                  <h2 className="section-title">Settings</h2>
                  
                  <div className="settings-card">
                    <h3 className="settings-card__title">Account</h3>
                    <div className="settings-item">
                      <div className="settings-item__info">
                        <span className="settings-item__label">{currentUser?.name}</span>
                        <span className="settings-item__desc">{currentUser?.email}</span>
                      </div>
                      <button className="settings-btn settings-btn--danger" onClick={handleLogout}>
                        Sign Out
                      </button>
                    </div>
                  </div>

                  <div className="settings-card">
                    <h3 className="settings-card__title">Security</h3>
                    <form className="settings-item settings-item--form" onSubmit={handleUpdatePassword}>
                      <div className="settings-item__info">
                        <span className="settings-item__label">Reset Password</span>
                        <span className="settings-item__desc">Enter a new secure password for your account</span>
                        <div className="settings-password-form">
                          <input 
                            type="password" 
                            className="settings-input" 
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <input 
                            type="password" 
                            className="settings-input" 
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <button type="submit" className="settings-btn settings-btn--primary" disabled={!newPassword || !confirmPassword}>
                        Update
                      </button>
                    </form>
                  </div>

                  <div className="settings-card">
                    <h3 className="settings-card__title">Data Management</h3>
                    <div className="settings-item">
                      <div className="settings-item__info">
                        <span className="settings-item__label">Export Data (PDF)</span>
                        <span className="settings-item__desc">Download your entire job application history as a professional document</span>
                      </div>
                      <button className="settings-btn settings-btn--primary" onClick={handleFullExport}>
                        Export PDF
                      </button>
                    </div>
                    <div className="settings-item">
                      <div className="settings-item__info">
                        <span className="settings-item__label">Clear All Data</span>
                        <span className="settings-item__desc">Remove all your job applications permanently</span>
                      </div>
                      <button className="settings-btn settings-btn--danger" onClick={handleClearData}>
                        Clear Data
                      </button>
                    </div>
                  </div>

                  <div className="settings-card settings-card--danger">
                    <h3 className="settings-card__title">Danger Zone</h3>
                    {!isDeleteMode ? (
                      <div className="settings-item">
                        <div className="settings-item__info">
                          <span className="settings-item__label">Delete Account</span>
                          <span className="settings-item__desc">Permanently remove your account and all associated data</span>
                        </div>
                        <button className="settings-btn settings-btn--danger" onClick={() => setIsDeleteMode(true)}>
                          Delete Account
                        </button>
                      </div>
                    ) : (
                      <form className="delete-consent" onSubmit={handleDeleteAccount}>
                        <div className="delete-consent__warning">
                          <HiOutlineExclamationTriangle className="delete-consent__icon" />
                          <div className="delete-consent__text">
                            <strong>This action is irreversible.</strong> All your job applications, settings, and account details will be permanently wiped.
                          </div>
                        </div>
                        <div className="delete-consent__action">
                          <p className="delete-consent__prompt">To confirm, please type <strong>delete</strong> below:</p>
                          <input 
                            type="text" 
                            className="settings-input settings-input--danger" 
                            placeholder='Type "delete" to confirm'
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                          />
                          <div className="delete-consent__btns">
                            <button type="button" className="settings-btn" onClick={() => setIsDeleteMode(false)}>
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="settings-btn settings-btn--danger" 
                              disabled={deleteConfirmText.trim().toLowerCase() !== 'delete'}
                            >
                              Final Delete
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </AuthGuard>
            } />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <AddJobModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleAddOrEdit} 
        editingJob={editingJob} 
      />

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        jobs={allJobs}
        onDownload={handleDownloadSelected}
      />

      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />
    </div>
  );
}
