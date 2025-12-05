import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Server, LogOut, Factory, Users, ClipboardList, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const BackofficeLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);
  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans text-slate-800">
      {/* App Header */}
      <header className="bg-primary text-white h-16 flex items-center justify-between px-6 shadow-md z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Server className="text-secondary h-6 w-6" />
            <h1 className="font-bold text-lg tracking-wide">Back-office</h1>
          </div>
          <nav className="flex gap-2">
            <NavLink
              to="/backoffice/plants"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Factory className="h-4 w-4" />
              Fabrieken
            </NavLink>
            <NavLink
              to="/backoffice/employees"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Users className="h-4 w-4" />
              Werknemers
            </NavLink>
            <NavLink
              to="/backoffice/tasks"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <ClipboardList className="h-4 w-4" />
              Taken
            </NavLink>
            <NavLink
              to="/backoffice/teams"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Users className="h-4 w-4" />
              Teams
            </NavLink>
            <NavLink
              to="/backoffice/absence"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm",
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <Calendar className="h-4 w-4" />
              Afwezigheid
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4 relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="text-right">
              <div className="text-sm font-bold text-white">{user?.name}</div>
              <div className="text-xs text-slate-300">{user?.role}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-md border-2 border-primary-light">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 text-slate-800">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Afmelden
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col p-6 max-w-[1500px] mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default BackofficeLayout;
