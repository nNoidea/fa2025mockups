import React, { useState } from 'react';
import { useNotifications, Notification } from '@/context/NotificationContext';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight, BedDouble, Umbrella, Calendar, Info, CalendarDays, Check, XCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { notifications, deleteNotification, markRead } = useNotifications();
  const { showToast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  const [rejectionReason, setRejectionReason] = useState('');

  const alertNotifications = notifications.filter(n => n.type === 'alert' && !n.read);

  const handleNotificationClick = (note: Notification) => {
    if (!note.read) {
      markRead(note.id);
    }
    setSelectedNotification(note);
    setRejectionReason('');
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
    setRejectionReason('');
  };

  const handleApprove = () => {
    if (selectedNotification) {
      deleteNotification(selectedNotification.id);
      showToast(`Verlofaanvraag van ${selectedNotification.person || 'Medewerker'} goedgekeurd`, 'success');
      handleCloseModal();
    }
  };

  const handleReject = () => {
    if (selectedNotification) {
      deleteNotification(selectedNotification.id);
      const reasonText = rejectionReason ? ` (Reden: ${rejectionReason})` : '';
      showToast(`Verlofaanvraag van ${selectedNotification.person || 'Medewerker'} afgewezen${reasonText}`, 'info');
      handleCloseModal();
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
          <span className="text-sm text-slate-500 font-medium uppercase">Geplande Uren</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">38h 15m</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm text-slate-500 font-medium uppercase">Openstaande Taken</span>
          <span className="text-3xl font-bold text-accent mt-2">12</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm text-slate-500 font-medium uppercase">Taken Vandaag</span>
          <span className="text-3xl font-bold text-orange-500 mt-2">5</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <span className="text-sm text-slate-500 font-medium uppercase">Dekkingsgraad</span>
          <span className="text-3xl font-bold text-success mt-2">94%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Widget 2: My Upcoming Shifts & Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">Mijn Komende Diensten & Taken</h3>
          </div>
          <div className="p-6 overflow-y-auto max-h-[400px]">
            <div className="space-y-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-shrink-0 w-16 text-center border-r border-slate-200 pr-4">
                    <div className="text-xs text-slate-500 uppercase font-bold">Nov</div>
                    <div className="text-xl font-bold text-slate-800">{29 + i}</div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800">Productielijn A - Assemblage</h4>
                        <p className="text-sm text-slate-500">08:00 - 16:00</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Dienst
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Widget 3: Critical Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Dringende Notificaties</h3>
              <Link to="/cockpit/notifications" className="text-sm text-secondary hover:underline">Alles Bekijken</Link>
            </div>
            <div className="p-4 space-y-3">
              {alertNotifications.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-2">Geen dringende meldingen.</p>
              ) : (
                alertNotifications.slice(0, 1).map(note => (
                  <div 
                    key={note.id} 
                    onClick={() => handleNotificationClick(note)}
                    className="bg-red-50 border-l-4 border-danger p-4 rounded-r-lg cursor-pointer hover:bg-red-100 transition-colors"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="text-danger h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-bold text-red-800">{note.title}</p>
                        <p className="text-sm text-red-700 mt-1">{note.message}</p>
                        <p className="text-xs text-red-600 mt-2">{note.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Widget 4: Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
            <h3 className="font-bold text-slate-800 mb-4">Snelle Acties</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors group">
                <span className="flex items-center gap-3">
                  <BedDouble className="text-danger h-5 w-5" /> Ziekte Melden
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors group">
                <span className="flex items-center gap-3">
                  <Umbrella className="text-secondary h-5 w-5" /> Verlof Aanvragen
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors group">
                <span className="flex items-center gap-3">
                  <Calendar className="text-success h-5 w-5" /> Bekijk Volledige Planning
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!selectedNotification}
        onClose={handleCloseModal}
        title={selectedNotification?.title || 'Details'}
        className="max-w-md"
      >
        {selectedNotification && (
          <div className="space-y-6">
            {/* ... (header and details) */}
            <div className="flex items-start gap-4">
              <div className={cn(
                "p-3 rounded-full shrink-0",
                selectedNotification.type === 'alert' ? "bg-red-100 text-red-600" : 
                selectedNotification.type === 'holiday_request' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
              )}>
                {selectedNotification.type === 'alert' ? <AlertTriangle className="h-6 w-6" /> : 
                 selectedNotification.type === 'holiday_request' ? <CalendarDays className="h-6 w-6" /> : 
                 <Info className="h-6 w-6" />}
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-800">{selectedNotification.title}</h4>
                <p className="text-slate-600 mt-1">{selectedNotification.message}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
              {selectedNotification.person && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500">Werknemer</span>
                  <span className="text-sm font-medium text-slate-800">{selectedNotification.person}</span>
                </div>
              )}
              
              {(selectedNotification.startDate || selectedNotification.endDate) && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-sm text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3" /> Periode</span>
                  <span className="text-sm font-medium text-slate-800">
                    {selectedNotification.startDate} - {selectedNotification.endDate}
                  </span>
                </div>
              )}

              {selectedNotification.reason && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-slate-500">Reden</span>
                  <span className="text-sm font-medium text-slate-800 italic">"{selectedNotification.reason}"</span>
                </div>
              )}
            </div>

            {selectedNotification.type === 'holiday_request' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-slate-700 mb-1">
                    Reden voor afwijzing (optioneel)
                  </label>
                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[80px]"
                    placeholder="Typ hier een reden..."
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleApprove}
                    className="flex-1 bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" /> Goedkeuren
                  </button>
                  <button 
                    onClick={handleReject}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" /> Afwijzen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleCloseModal}
                  className="bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Sluiten
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
