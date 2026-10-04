import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { BuildPlanModal } from './components/modals/BuildPlanModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudyPage } from './pages/StudyPage';
import { CodePage } from './pages/CodePage';
import { PlannerPage } from './pages/PlannerPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

import './styles/main.css';

const AppShell: React.FC = () => {
  const [isBuildPlanModalOpen, setIsBuildPlanModalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <Sidebar onOpenBuildPlan={() => setIsBuildPlanModalOpen(true)} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar />
        <main className="page-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/code" element={<CodePage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <MobileNav />

      {/* Global Build Plan Modal */}
      <BuildPlanModal
        isOpen={isBuildPlanModalOpen}
        onClose={() => setIsBuildPlanModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
