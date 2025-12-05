import React, { useState } from 'react';
import { BellOff, Info, AlertTriangle, Check, XCircle, CalendarDays, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications, Notification } from '@/context/NotificationContext';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

const NotificationsPage: React.FC = () => {
  const { notifications, deleteNotification, markRead } = useNotifications();
  const { showToast } = useToast();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
    <div className="flex flex-col h-full gap-6 max-w-3xl mx-auto w-full">
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <BellOff className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Geen meldingen</h3>
            <p className="text-slate-500">Je bent helemaal bij!</p>
          </div>
        ) : (
          notifications.map(note => (
            <div 
              key={note.id}
              onClick={() => handleNotificationClick(note)}
              className={cn(
                "bg-white p-4 rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md",
                note.read ? "opacity-60 bg-slate-50 border-slate-100" : "border-l-4 hover:border-blue-200",
                !note.read && note.type === 'alert' ? "border-l-red-500" : 
                !note.read && note.type === 'holiday_request' ? "border-l-blue-500" : 
                !note.read ? "border-l-slate-300" : ""
              )}
            >
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    note.type === 'alert' ? "bg-red-100 text-red-600" : 
                    note.type === 'holiday_request' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {note.type === 'alert' ? <AlertTriangle className="h-5 w-5" /> : 
                     note.type === 'holiday_request' ? <CalendarDays className="h-5 w-5" /> : 
                     <Info className="h-5 w-5" />}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className={cn("font-bold", note.read ? "text-slate-600" : "text-slate-800")}>{note.title}</h4>
                    <div className="flex items-center gap-2">
                      {note.read && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                          Gelezen
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{note.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{note.message}</p>
                  {note.person && <p className="text-xs text-slate-500 mt-1 font-medium">{note.person}</p>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        isOpen={!!selectedNotification}
        onClose={handleCloseModal}
        title={selectedNotification?.title || 'Details'}
        className="max-w-md"
      >
        {selectedNotification && (
          <div className="space-y-6">
            {/* ... header and details ... */}
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

export default NotificationsPage;
