import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import BackofficeLoginPage from './pages/backoffice/Login';
import CockpitLoginPage from './pages/cockpit/Login';
import LandingPage from './pages/LandingPage';

// Backoffice
import BackofficeLayout from './components/layout/BackofficeLayout';
import EmployeesPage from './pages/backoffice/Employees';
import PlantsPage from './pages/backoffice/Plants';
import TasksPage from './pages/backoffice/Tasks';
import AbsencePage from './pages/backoffice/Absence';
import TeamsPage from './pages/backoffice/Teams';

// Cockpit
import CockpitLayout from './components/layout/CockpitLayout';
import Dashboard from './pages/cockpit/Dashboard';
import CockpitPlanningPage from './pages/cockpit/Planning';
import CockpitTasksPage from './pages/cockpit/Tasks';
import CockpitPlantsPage from './pages/cockpit/Plants';
import CockpitAbsencePage from './pages/cockpit/Absence';
import CockpitNotificationsPage from './pages/cockpit/Notifications';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on the requested path
    const isBackoffice = location.pathname.startsWith('/backoffice');
    const loginPath = isBackoffice ? '/backoffice/login' : '/cockpit/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Login Routes */}
            <Route path="/backoffice/login" element={<BackofficeLoginPage />} />
            <Route path="/cockpit/login" element={<CockpitLoginPage />} />
            
            {/* Redirect legacy login to cockpit login for now, or just 404 */}
            <Route path="/login" element={<Navigate to="/cockpit/login" replace />} />
            
            <Route path="/" element={<LandingPage />} />
            
            {/* Backoffice App */}
            <Route path="/backoffice" element={
              <RequireAuth>
                <BackofficeLayout />
              </RequireAuth>
            }>
            <Route index element={<Navigate to="employees" replace />} />
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="plants" element={<PlantsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="absence" element={<AbsencePage />} />
          </Route>

            {/* Cockpit App */}
            <Route path="/cockpit" element={
              <RequireAuth>
                <CockpitLayout />
              </RequireAuth>
            }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="planning" element={<CockpitPlanningPage />} />
            <Route path="tasks" element={<CockpitTasksPage />} />
            <Route path="plants" element={<CockpitPlantsPage />} />
            <Route path="absence" element={<CockpitAbsencePage />} />
            <Route path="notifications" element={<CockpitNotificationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
