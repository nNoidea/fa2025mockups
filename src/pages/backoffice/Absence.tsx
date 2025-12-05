import React, { useState } from 'react';
import { Check, X, Edit, Trash, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ColumnHeader from '@/components/ui/ColumnHeader';
import { useTableState } from '@/hooks/useTableState';
import { useToast } from '@/components/ui/Toast';

import { mockAbsence, Absence } from '@/data/mockData';

const AbsencePage: React.FC = () => {
  const { 
    data: absences, 
    setData: setAbsences, 
    processedData: filteredAbsences,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  } = useTableState<Absence>(mockAbsence);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<number | null>(null);
  const [modalType, setModalType] = useState<'Ziekte' | 'Verlof'>('Verlof');
  const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
  const [formData, setFormData] = useState<Partial<Absence>>({ status: 'In Behandeling' });

  const handleAdd = () => {
    setEditingAbsence(null);
    setFormData({ status: 'In Behandeling' });
    setModalType('Verlof'); // Default to Holiday when adding
    setIsModalOpen(true);
  };

  const handleEdit = (absence: Absence) => {
    setEditingAbsence(absence);
    setFormData(absence);
    setModalType(absence.type === 'Ziekte' ? 'Ziekte' : 'Verlof');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAbsenceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (absenceToDelete) {
      setAbsences(prev => prev.filter(a => a.id !== absenceToDelete));
      showToast('Afwezigheid succesvol verwijderd', 'success');
      setAbsenceToDelete(null);
    }
  };

  const handleApproval = (id: number, status: 'Goedgekeurd' | 'Geweigerd') => {
    setAbsences(absences.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Afwezigheid ${status.toLowerCase()} succesvol`, 'success');
  };

  const handleSave = () => {
    if (editingAbsence) {
      setAbsences(prev => prev.map(a => a.id === editingAbsence.id ? { ...a, ...formData } as Absence : a));
      showToast('Afwezigheid succesvol bijgewerkt', 'success');
    } else {
      const newAbsence: Absence = {
        id: Math.floor(Math.random() * 1000) + 100,
        employeeName: formData.employeeName || 'Huidige Gebruiker', // Placeholder, ideally from user context
        type: modalType,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || new Date().toISOString().split('T')[0],
        status: 'In Behandeling',
        reason: formData.reason || ''
      };
      setAbsences(prev => [...prev, newAbsence]);
      showToast('Afwezigheidsaanvraag ingediend', 'success');
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Werknemer', 'Type', 'Start', 'Einde', 'Status'];
    const rows = absences.map(a => [
      a.id, a.employeeName, a.type, a.startDate, a.endDate, a.status
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'afwezigheden.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
      <PageHeader 
        title="Afwezigheidsbeheer"
        onExport={exportCSV}
        onAdd={handleAdd}
        addLabel="Afwezigheid Registreren"
      />

      {/* Data Grid */}
      <div className="flex-1 overflow-auto">

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
            <tr>
              <ColumnHeader<Absence> 
                columnKey="employeeName"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'employeeName' ? sortConfig.direction : null}
                currentFilter={filters.employeeName}
                onSort={(dir) => handleSort('employeeName', dir)}
                onFilter={(val) => handleFilter('employeeName', val)}
              >Werknemer</ColumnHeader>
              <ColumnHeader<Absence> 
                columnKey="type"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Ziekte', 'Verlof', 'Persoonlijk', 'Ouderschapsverlof']}
                currentSort={sortConfig?.key === 'type' ? sortConfig.direction : null}
                currentFilter={filters.type}
                onSort={(dir) => handleSort('type', dir)}
                onFilter={(val) => handleFilter('type', val)}
              >Type</ColumnHeader>
              <ColumnHeader<Absence> 
                columnKey="startDate"
                sortable 
                filterable
                currentSort={sortConfig?.key === 'startDate' ? sortConfig.direction : null}
                currentFilter={filters.startDate}
                onSort={(dir) => handleSort('startDate', dir)}
                onFilter={(val) => handleFilter('startDate', val)}
              >Datums</ColumnHeader>
              <ColumnHeader<Absence> 
                columnKey="status"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['In Behandeling', 'Goedgekeurd', 'Geweigerd']}
                currentSort={sortConfig?.key === 'status' ? sortConfig.direction : null}
                currentFilter={filters.status}
                onSort={(dir) => handleSort('status', dir)}
                onFilter={(val) => handleFilter('status', val)}
              >Status</ColumnHeader>
              <ColumnHeader className="text-right w-[75px]">Acties</ColumnHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAbsences.map((absence) => (
              <tr key={absence.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{absence.employeeName}</td>
                <td className="px-6 py-4">{absence.type}</td>
                <td className="px-6 py-4">
                  {absence.startDate} - {absence.endDate}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {absence.status}
                  </span>
                </td>
                <td className="px-2 py-4 text-right flex justify-end gap-2 w-[75px]">
                  <button 
                    onClick={() => handleEdit(absence)}
                    className="text-slate-400 hover:text-blue-600"
                    title="Bewerken"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(absence.id)}
                    className="text-slate-400 hover:text-red-500"
                    title="Verwijderen"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleApproval(absence.id, 'Goedgekeurd')}
                    className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1 ml-3"
                  >
                    <Check className="h-4 w-4" /> Goedkeuren
                  </button>
                  <button 
                    onClick={() => handleApproval(absence.id, 'Geweigerd')}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 ml-3"
                  >
                    <X className="h-4 w-4" /> Weigeren
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Afwezigheid verwijderen"
        message="Weet u zeker dat u deze afwezigheid wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijderen"
        variant="danger"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAbsence ? "Afwezigheid bewerken" : "Afwezigheid registreren"}
      >
        <div className="flex gap-4 mb-4 border-b border-slate-200">
          <button 
            className={`pb-2 px-4 font-medium transition-colors ${modalType === 'Ziekte' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setModalType('Ziekte')}
          >
            Ziekte Melden
          </button>
          <button 
            className={`pb-2 px-4 font-medium transition-colors ${modalType === 'Verlof' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setModalType('Verlof')}
          >
            Verlof Aanvragen
          </button>
        </div>

        <div className="space-y-4">
          {modalType === 'Ziekte' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Startdatum</label>
                <input 
                  type="date" 
                  value={formData.startDate || ''}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Verwachte terugkeer</label>
                <input 
                  type="date" 
                  value={formData.endDate || ''}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>Medisch attest vereist voor afwezigheden langer dan 2 dagen.</p>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Startdatum</label>
                  <input 
                    type="date" 
                    value={formData.startDate || ''}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Einddatum</label>
                  <input 
                    type="date" 
                    value={formData.endDate || ''}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reden (Optioneel)</label>
                <textarea 
                  value={formData.reason || ''}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={3}
                  placeholder="bv. Zomervakantie"
                />
              </div>
            </>
          )}

          <div className="pt-4 flex justify-end gap-2">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Annuleren
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingAbsence ? 'Wijzigingen opslaan' : 'Aanvraag indienen'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AbsencePage;
