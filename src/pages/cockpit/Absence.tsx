import React, { useState } from 'react';
import { UserMinus, Plane, AlertCircle, Info } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

import { useToast } from '@/components/ui/Toast';

import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface Absence {
  id: number;
  type: 'Illness' | 'Holiday';
  startDate: string;
  endDate?: string;
  status: 'Pending' | 'Approved' | 'Denied';
  reason?: string;
}

const initialAbsences: Absence[] = [
  { id: 1, type: 'Illness', startDate: '2023-11-10T09:00', endDate: '2023-11-12T17:00', status: 'Approved', reason: 'Flu' },
  { id: 2, type: 'Holiday', startDate: '2023-12-24T09:00', endDate: '2023-12-31T17:00', status: 'Pending' },
];

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('nl-BE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const AbsencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'illness' | 'holiday'>('illness');
  const [absences, setAbsences] = useState<Absence[]>(initialAbsences);
  const [illnessForm, setIllnessForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [holidayForm, setHolidayForm] = useState({ startDate: '', endDate: '' });
  const { showToast } = useToast();
  
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [absenceToCancel, setAbsenceToCancel] = useState<number | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmitIllness = () => {
    const newErrors: { [key: string]: string } = {};
    if (!illnessForm.startDate) {
      newErrors.illnessStartDate = 'Startdatum is verplicht';
    }
    if (!illnessForm.endDate) {
      newErrors.illnessEndDate = 'Einddatum is verplicht';
    }
    
    if (illnessForm.endDate && new Date(illnessForm.endDate) < new Date(illnessForm.startDate)) {
      showToast('Einddatum mag niet voor startdatum liggen', 'error');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAbsence: Absence = {
      id: Date.now(),
      type: 'Illness',
      startDate: illnessForm.startDate,
      endDate: illnessForm.endDate,
      status: 'Approved', // Illness is auto-approved in this mock
      reason: illnessForm.reason,
    };
    setAbsences([newAbsence, ...absences]);
    setIllnessForm({ startDate: '', endDate: '', reason: '' });
    setErrors({});
    showToast('Ziekte succesvol gemeld', 'success');
  };

  const handleSubmitHoliday = () => {
    const newErrors: { [key: string]: string } = {};
    if (!holidayForm.startDate) {
      newErrors.holidayStartDate = 'Startdatum is verplicht';
    }
    if (!holidayForm.endDate) {
      newErrors.holidayEndDate = 'Einddatum is verplicht';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (new Date(holidayForm.endDate) < new Date(holidayForm.startDate)) {
      showToast('Einddatum mag niet voor startdatum liggen', 'error');
      return;
    }

    const newAbsence: Absence = {
      id: Date.now(),
      type: 'Holiday',
      startDate: holidayForm.startDate,
      endDate: holidayForm.endDate,
      status: 'Pending',
    };
    setAbsences([newAbsence, ...absences]);
    setHolidayForm({ startDate: '', endDate: '' });
    setErrors({});
    showToast('Verlofaanvraag succesvol ingediend', 'success');
  };

  const handleCancelClick = (id: number) => {
    setAbsenceToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (absenceToCancel) {
      setAbsences(absences.filter(a => a.id !== absenceToCancel));
      showToast('Afwezigheid succesvol geannuleerd', 'success');
      setAbsenceToCancel(null);
    }
    setIsCancelModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full gap-6 max-w-4xl mx-auto w-full pb-24">
      
      {/* Tabs & Forms */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => {
              setActiveTab('illness');
              setErrors({});
            }}
            className={cn(
              "flex-1 py-4 text-center font-medium text-sm transition-colors relative flex items-center justify-center gap-2",
              activeTab === 'illness' ? "text-red-600 bg-red-50" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <UserMinus className="h-4 w-4" /> Ziekte Melden
            {activeTab === 'illness' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />}
          </button>
          <button 
            onClick={() => {
              setActiveTab('holiday');
              setErrors({});
            }}
            className={cn(
              "flex-1 py-4 text-center font-medium text-sm transition-colors relative flex items-center justify-center gap-2",
              activeTab === 'holiday' ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Plane className="h-4 w-4" /> Verlof Aanvragen
            {activeTab === 'holiday' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />}
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'illness' ? (
            <div className="space-y-4 fade-in">
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-sm text-red-800 mb-6 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Belangrijk:</strong> Het melden van ziekte zal automatisch al uw geplande taken voor de duur van de ziekte annuleren. Uw manager wordt onmiddellijk op de hoogte gebracht.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Startdatum <span className="text-red-600">*</span>
                    {errors.illnessStartDate && <span className="text-red-600 text-xs ml-2 font-normal">{errors.illnessStartDate}</span>}
                  </label>
                  <input 
                    type="datetime-local" 
                    value={illnessForm.startDate}
                    onChange={e => {
                      setIllnessForm({...illnessForm, startDate: e.target.value});
                      if (errors.illnessStartDate) setErrors({...errors, illnessStartDate: ''});
                    }}
                    className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.illnessStartDate ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Verwachte Einddatum <span className="text-red-600">*</span>
                    {errors.illnessEndDate && <span className="text-red-600 text-xs ml-2 font-normal">{errors.illnessEndDate}</span>}
                  </label>
                  <input 
                    type="datetime-local" 
                    value={illnessForm.endDate}
                    onChange={e => {
                      setIllnessForm({...illnessForm, endDate: e.target.value});
                      if (errors.illnessEndDate) setErrors({...errors, illnessEndDate: ''});
                    }}
                    className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.illnessEndDate ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reden / Opmerking</label>
                <textarea 
                  rows={3}
                  value={illnessForm.reason}
                  onChange={e => setIllnessForm({...illnessForm, reason: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Optionele details..."
                />
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleSubmitIllness}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 transition-colors"
                >
                  Ziekte Melden
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 fade-in">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mb-6 flex items-start gap-2">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  Verlofaanvragen vereisen goedkeuring van uw supervisor. Gelieve minstens 2 weken op voorhand in te dienen.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Startdatum <span className="text-red-600">*</span>
                    {errors.holidayStartDate && <span className="text-red-600 text-xs ml-2 font-normal">{errors.holidayStartDate}</span>}
                  </label>
                  <input 
                    type="datetime-local" 
                    value={holidayForm.startDate}
                    onChange={e => {
                      setHolidayForm({...holidayForm, startDate: e.target.value});
                      if (errors.holidayStartDate) setErrors({...errors, holidayStartDate: ''});
                    }}
                    className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.holidayStartDate ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Einddatum <span className="text-red-600">*</span>
                    {errors.holidayEndDate && <span className="text-red-600 text-xs ml-2 font-normal">{errors.holidayEndDate}</span>}
                  </label>
                  <input 
                    type="datetime-local" 
                    value={holidayForm.endDate}
                    onChange={e => {
                      setHolidayForm({...holidayForm, endDate: e.target.value});
                      if (errors.holidayEndDate) setErrors({...errors, holidayEndDate: ''});
                    }}
                    className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.holidayEndDate ? 'border-red-500' : 'border-slate-300'}`}
                  />
                </div>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleSubmitHoliday}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors"
                >
                  Verlof Aanvragen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Absence History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">Afwezigheidsgeschiedenis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Startdatum</th>
                <th className="px-6 py-3">Einddatum</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {absences.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Geen afwezigheidsgeschiedenis gevonden.
                  </td>
                </tr>
              ) : (
                absences.map(absence => (
                  <tr key={absence.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        {absence.type === 'Illness' ? <UserMinus className="h-4 w-4 text-red-500" /> : <Plane className="h-4 w-4 text-blue-500" />}
                        <span>{absence.type === 'Illness' ? 'Ziekte' : 'Verlof'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(absence.startDate)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatDate(absence.endDate || '')}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        absence.status === 'Pending' ? 'warning' : 
                        absence.status === 'Approved' ? 'success' : 'danger'
                      }>
                        {absence.status === 'Pending' ? 'In behandeling' : absence.status === 'Approved' ? 'Goedgekeurd' : 'Geweigerd'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(absence.status === 'Pending' || (absence.status === 'Approved' && absence.type === 'Illness')) ? (
                        <button 
                          onClick={() => handleCancelClick(absence.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors text-xs font-bold uppercase"
                        >
                          Annuleren
                        </button>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Afwezigheid Annuleren"
        message="Weet u zeker dat u deze afwezigheid wilt annuleren? Dit kan niet ongedaan worden gemaakt."
        confirmLabel="Annuleren Bevestigen"
        cancelLabel="Terug"
        variant="danger"
      />
    </div>
  );
};

export default AbsencePage;
