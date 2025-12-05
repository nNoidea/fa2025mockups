import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  BarChart2, Calendar, ClipboardList, Factory, Clock, Bell, 
  LogOut, Menu, X, TowerControl, AlertCircle, Info, Play, Check, XCircle, CalendarDays 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useToast } from '@/components/ui/Toast';

const CockpitLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSimulateBtn, setShowSimulateBtn] = useState(false);
  const { unreadCount, notifications, addNotification, deleteNotification, markRead } = useNotifications();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleSimulateNotification = () => {
    addNotification({
      title: 'Nieuwe Ziekte Melding',
      message: 'Heeft zich ziek gemeld.',
      time: 'Zojuist',
      type: 'alert',
      person: 'Jan Janssen',
      startDate: '04/12/2023 08:30',
      endDate: '06/12/2023 17:00',
      reason: 'Griep'
    });
    showToast('Nieuwe ziektemelding ontvangen: Jan Janssen', 'error');
    setShowSimulateBtn(false);
  };

  const handleApprove = (id: number, person: string) => {
    deleteNotification(id);
    showToast(`Verlofaanvraag van ${person} goedgekeurd`, 'success');
  };

  const handleReject = (id: number, person: string) => {
    deleteNotification(id);
    showToast(`Verlofaanvraag van ${person} afgewezen`, 'info');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* ... (Sidebar and Header remain mostly the same, just keeping the structure) */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white transition-all duration-300 z-20">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <TowerControl className="text-secondary h-6 w-6" />
          <span className="font-bold text-xl tracking-wide">Cockpit</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <NavLink to="/cockpit/dashboard" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <BarChart2 className="w-5 h-5" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/cockpit/planning" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <Calendar className="w-5 h-5" /> Planningbord
              </NavLink>
            </li>
            <li>
              <NavLink to="/cockpit/tasks" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <ClipboardList className="w-5 h-5" /> Takenoverzicht
              </NavLink>
            </li>
            <li>
              <NavLink to="/cockpit/plants" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <Factory className="w-5 h-5" /> Fabrieken & KPI's
              </NavLink>
            </li>
            <li>
              <NavLink to="/cockpit/absence" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <Clock className="w-5 h-5" /> Afwezigheden
              </NavLink>
            </li>
            <li>
              <NavLink to="/cockpit/notifications" className={({ isActive }) => cn("flex items-center gap-3 px-4 py-3 rounded-lg transition-colors", isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                <Bell className="w-5 h-5" /> Meldingen
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700 space-y-2">
          {showSimulateBtn && (
            <button onClick={handleSimulateNotification} className="flex items-center gap-3 px-4 py-2 text-amber-400 hover:text-amber-300 transition-colors text-sm w-full text-left font-medium animate-pulse">
              <Play className="w-4 h-4" /> Simuleer Melding
            </button>
          )}
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm w-full text-left">
            <LogOut className="w-4 h-4" /> Afmelden
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/80" onClick={toggleSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary text-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={toggleSidebar} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <X className="text-white h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <TowerControl className="text-secondary h-6 w-6 mr-3" />
                <span className="font-bold text-xl">Cockpit</span>
              </div>
              <nav className="px-2 space-y-1">
                <Link to="/cockpit/dashboard" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <BarChart2 className="mr-4 h-6 w-6" /> Dashboard
                </Link>
                <Link to="/cockpit/planning" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Calendar className="mr-4 h-6 w-6" /> Planningbord
                </Link>
                <Link to="/cockpit/tasks" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <ClipboardList className="mr-4 h-6 w-6" /> Takenoverzicht
                </Link>
                <Link to="/cockpit/plants" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Factory className="mr-4 h-6 w-6" /> Fabrieken & KPI's
                </Link>
                <Link to="/cockpit/absence" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Clock className="mr-4 h-6 w-6" /> Afwezigheden
                </Link>
                <Link to="/cockpit/notifications" onClick={toggleSidebar} className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white">
                  <Bell className="mr-4 h-6 w-6" /> Meldingen
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-slate-700 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleNotifications} className="relative p-2 text-slate-500 hover:text-secondary transition-colors">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="relative ml-4 border-l border-slate-200 pl-4">
              <button 
                onClick={toggleProfile}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-800">{user?.name || 'Gebruiker'}</div>
                  <div className="text-xs text-slate-500">{user?.role || 'Gast'}</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-md">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-slate-100">
                    <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                      <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                      <div className="text-xs text-slate-500">{user?.role}</div>
                    </div>
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Notification Slide-over */}
      {notificationsOpen && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/75" onClick={toggleNotifications}></div>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md bg-white shadow-xl flex flex-col">
                <div className="px-4 py-6 border-b border-slate-100 flex justify-between">
                  <h2 className="text-lg font-medium">Meldingen</h2>
                  <button onClick={toggleNotifications}><X className="h-5 w-5" /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-slate-500 text-sm">Geen meldingen</p>
                  ) : (
                    notifications.map(note => (
                      <div 
                        key={note.id} 
                        onClick={() => !note.read && markRead(note.id)}
                        className={cn("p-4 rounded-lg border flex gap-3 transition-colors cursor-pointer", 
                        note.read ? "opacity-60 bg-white border-slate-100" : 
                        note.type === 'alert' ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
                      )}>
                        <div className={cn("mt-0.5 flex-shrink-0", 
                          note.type === 'alert' ? "text-red-600" : 
                          note.type === 'holiday_request' ? "text-blue-600" : "text-slate-500"
                        )}>
                          {note.type === 'alert' ? <AlertCircle className="h-5 w-5" /> : 
                           note.type === 'holiday_request' ? <CalendarDays className="h-5 w-5" /> : 
                           <Info className="h-5 w-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={cn("font-bold text-sm", note.read ? "text-slate-600" : "text-slate-800")}>{note.title}</h4>
                            <div className="flex items-center gap-2">
                              {note.read && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                  Gelezen
                                </span>
                              )}
                              <span className="text-xs text-slate-400">{note.time}</span>
                            </div>
                          </div>
                          
                          {note.person && (
                            <p className="text-sm font-medium text-slate-700 mt-1">{note.person}</p>
                          )}
                          
                          <p className="text-sm text-slate-600 mt-1">{note.message}</p>
                          
                          {(note.startDate || note.endDate) && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                              <Calendar className="h-3 w-3" />
                              <span>{note.startDate} - {note.endDate}</span>
                            </div>
                          )}

                          {note.reason && (
                            <p className="text-xs text-slate-500 mt-2 italic">"{note.reason}"</p>
                          )}

                          {note.type === 'holiday_request' && !note.read && (
                            <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => handleApprove(note.id, note.person || 'Medewerker')}
                                className="flex-1 bg-green-600 text-white text-xs font-bold py-2 px-3 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                              >
                                <Check className="h-3 w-3" /> Goedkeuren
                              </button>
                              <button 
                                onClick={() => handleReject(note.id, note.person || 'Medewerker')}
                                className="flex-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2 px-3 rounded hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                              >
                                <XCircle className="h-3 w-3" /> Afwijzen
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CockpitLayout;
