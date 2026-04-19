# JobPulse — Modern Internship & Job Application Tracker

JobPulse is a premium, professional-grade web application designed to help candidates streamline their career search. Built with a focus on privacy, aesthetics, and utility, it offers a centralized dashboard for tracking applications, analyzing search patterns, and exporting professional PDF reports.

---

## 🚀 Project Overview

**JobPulse** addresses the common fragmentation in the internship search process. Instead of relying on scattered spreadsheets or emails, JobPulse provides an isolated, multi-user environment where every candidate can manage their journey with professional-grade tools.

### 🎯 Objective
To empower job seekers with a data-driven approach to their search, offering insights through analytics and providing a seamless way to generate application summaries for mentors or placement cells.

---

## ✨ Core Features

### 👤 Authentication & Isolation
- **Secure Local Accounts**: Full signup and login functionality using a persistent storage engine.
- **Data Privacy**: Complete isolation of application data between users; your data is strictly yours.
- **Session Management**: Persistent sessions that keep you logged in across browser refreshes.

### 📋 Advanced Job Tracking
- **Smart CRUD**: Add, edit, and remove job applications with a modern, high-speed interface.
- **Status Lifecycle**: Track jobs through four key stages: *Applied, Interview, Offer,* and *Rejected*.
- **Quick Actions**: One-click status updates and deletions directly from the dashboard card.

### 📊 Real-time Analytics
- **Activity Visualization**: A dynamic bar chart showing application volume over the last 7 days.
- **Status Breakdown**: Visual progress bars showing the distribution of your current pipeline.
- **Performance KPIs**: Automatic calculation of "This Week vs Last Week" trends and overall success rates.

### 📄 Professional PDF Engine
- **Full Export**: Generate a beautifully branded PDF of your entire application history.
- **Selective Export**: Use the Download Modal to filter and select specific jobs for targeted reporting.
- **Professional Layout**: Integrated PDF engine with auto-table formatting and branded headers.

### ⚙️ Account Management
- **Security Control**: In-app password reset features with typo-prevention validation.
- **Data Mobility**: Tools to clear all local data or export it before account removal.
- **Secure Deletion**: A "Danger Zone" with a typed-confirmation safety check to prevent accidental account loss.

---

## 🛠️ Technology Stack

JobPulse is built using a modern, lightweight, and scalable frontend stack:

| Category | Technology |
| :--- | :--- |
| **Core** | **React 19** (Functional Components + Hooks) |
| **Build Tool** | **Vite 8.0** (Lightning-fast HMR and bundling) |
| **Routing** | **React Router 7.1** (Declarative SPA routing) |
| **Styling** | **Vanilla CSS** (Custom Design System + Variable Tokens) |
| **Data Visualization** | **Custom SVG & CSS Multi-layer Charts** |
| **Utilities** | **jsPDF** & **jsPDF-AutoTable** (Reporting Engine) |
| **Icons** | **React Icons** (Hi2 - Heroicons set) |
| **ID Generation** | **UUID** (RFC4122 standard) |

---

## 📐 Development Approach

### 1. Unified Design System (`index.css`)
We follow a "Lite" premium aesthetic using a semantic color palette and global design tokens.
- **Glassmorphism**: Subtle translucent overlays for headers and sidebars.
- **Responsive Geometry**: A 1400px centered max-width layout for desktop and fluid padding for mobile.

### 2. Logic Separation (Custom Hooks)
- `useJobs.js`: Centralizes all job data logic, filtering, sorting, and stats calculation.
- `useAuth.js`: Handles all identity logic, user enrollment, and session persistence.

### 3. Context-Aware UI
The application uses a "Route-Aware" header system that adjusts its tools (Search, Filter, Export) based on whether you are on the Dashboard, Application List, or Settings page.

---

## 🧪 Testing & Validation

- **Manual UAT**: Verified every auth flow (Signup -> Login -> Logout -> Auth Guard check).
- **Edge Case Handling**: Implemented defensive checks for empty charts, zero-data exports, and invalid search queries.
- **Security Check**: Verified that deleting an account correctly purges all associated job keys from `localStorage`.
- **Responsive Audit**: Fully tested on Mobile, Tablet, and Desktop breakpoints.

---

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

*“Your Job Search, Organized.”* — **JobPulse**
