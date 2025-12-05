import React, { useState } from 'react';
import { Trash, Edit, ClipboardList } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ColumnHeader from '@/components/ui/ColumnHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useTableState } from '@/hooks/useTableState';
import { useToast } from '@/components/ui/Toast';

import { mockTasks, Task } from '@/data/mockData';

const TasksPage: React.FC = () => {
  const {
    data: tasks,
    setData: setTasks,
    processedData: filteredTasks,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  } = useTableState<Task>(mockTasks);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({ status: 'In Wacht', priority: 'Gemiddeld', category: 'Onderhoud' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    setEditingTask(null);
    setFormData({ status: 'In Wacht', priority: 'Gemiddeld', category: 'Onderhoud' });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData(task);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task && task.status !== 'Onnodig' && task.status !== 'Stopgezet') {
      showToast('Kan taak niet verwijderen: Alleen taken met status "Onnodig" of "Stopgezet" kunnen worden verwijderd.', 'error');
      return;
    }
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(t => t.id !== taskToDelete));
      showToast('Taak succesvol verwijderd', 'success');
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSave = () => {
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = 'Titel is verplicht';
    if (!formData.category) newErrors.category = 'Categorie is verplicht';
    if (!formData.specifications?.trim()) newErrors.specifications = 'Specificaties zijn verplicht';
    if (!formData.timeAllocation?.trim()) newErrors.timeAllocation = 'Tijdsduur is verplicht';
    if (!formData.plant?.trim()) newErrors.plant = 'Plant is verplicht';
    if (!formData.assignedTo?.trim() || formData.assignedTo === 'Niet toegewezen') newErrors.assignedTo = 'Toewijzing is verplicht';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...formData } as Task : t));
      showToast('Taak succesvol bijgewerkt', 'success');
    } else {
      const newTask: Task = {
        id: Math.floor(Math.random() * 1000) + 100,
        title: formData.title || 'Nieuwe Taak',
        assignedTo: formData.assignedTo || 'Niet toegewezen',
        status: formData.status || 'In Wacht',
        category: formData.category || 'Onderhoud',
        priority: formData.priority || 'Gemiddeld',
        startDate: formData.startDate,
        endDate: formData.endDate,
        dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
        plant: formData.plant || 'Algemeen',
        timeAllocation: formData.timeAllocation || '',
        specifications: formData.specifications || ''
      };
      setTasks(prev => [...prev, newTask]);
      showToast('Taak succesvol toegevoegd', 'success');
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Titel', 'Toegewezen aan', 'Fabriek', 'Status', 'Prioriteit', 'Vervaldatum', 'Specificaties', 'Tijdsallocatie'];
    const rows = tasks.map(t => [
      t.id, t.title, t.assignedTo, t.plant, t.status, t.priority, t.dueDate, `"${t.specifications.replace(/"/g, '""')}"`, `"${t.timeAllocation.replace(/"/g, '""')}"`
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taken.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
      <PageHeader 
        title="Taakdefinities"
        onExport={exportCSV}
        onAdd={handleAdd}
        addLabel="Toevoegen"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Taak verwijderen"
        message="Weet u zeker dat u deze taak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijderen"
        variant="danger"
      />

      {/* Data Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 sticky top-0 z-10 shadow-sm">
            <tr>
              <ColumnHeader<Task> 
                columnKey="id"
                sortable 
                filterable
                currentSort={sortConfig?.key === 'id' ? sortConfig.direction : null}
                currentFilter={filters.id}
                onSort={(dir) => handleSort('id', dir)}
                onFilter={(val) => handleFilter('id', val)}
              >ID</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="title"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'title' ? sortConfig.direction : null}
                currentFilter={filters.title}
                onSort={(dir) => handleSort('title', dir)}
                onFilter={(val) => handleFilter('title', val)}
              >Titel</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="assignedTo"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'assignedTo' ? sortConfig.direction : null}
                currentFilter={filters.assignedTo}
                onSort={(dir) => handleSort('assignedTo', dir)}
                onFilter={(val) => handleFilter('assignedTo', val)}
              >Toegewezen aan</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="plant"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'plant' ? sortConfig.direction : null}
                currentFilter={filters.plant}
                onSort={(dir) => handleSort('plant', dir)}
                onFilter={(val) => handleFilter('plant', val)}
              >Fabriek</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="status"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['In Wacht', 'Bezig', 'Voltooid', 'Geblokkeerd']}
                currentSort={sortConfig?.key === 'status' ? sortConfig.direction : null}
                currentFilter={filters.status}
                onSort={(dir) => handleSort('status', dir)}
                onFilter={(val) => handleFilter('status', val)}
              >Status</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="priority"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Laag', 'Gemiddeld', 'Hoog']}
                currentSort={sortConfig?.key === 'priority' ? sortConfig.direction : null}
                currentFilter={filters.priority}
                onSort={(dir) => handleSort('priority', dir)}
                onFilter={(val) => handleFilter('priority', val)}
              >Prioriteit</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="dueDate"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'dueDate' ? sortConfig.direction : null}
                currentFilter={filters.dueDate}
                onSort={(dir) => handleSort('dueDate', dir)}
                onFilter={(val) => handleFilter('dueDate', val)}
              >Vervaldatum</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="specifications"
                sortable 
                filterable
                currentSort={sortConfig?.key === 'specifications' ? sortConfig.direction : null}
                currentFilter={filters.specifications}
                onSort={(dir) => handleSort('specifications', dir)}
                onFilter={(val) => handleFilter('specifications', val)}
              >Specificaties</ColumnHeader>
              <ColumnHeader<Task> 
                columnKey="timeAllocation"
                sortable 
                filterable
                currentSort={sortConfig?.key === 'timeAllocation' ? sortConfig.direction : null}
                currentFilter={filters.timeAllocation}
                onSort={(dir) => handleSort('timeAllocation', dir)}
                onFilter={(val) => handleFilter('timeAllocation', val)}
              >Tijdsallocatie</ColumnHeader>
              <ColumnHeader className="text-right w-[75px]">Acties</ColumnHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-slate-600">{task.id}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{task.title}</td>
                <td className="px-6 py-4">{task.assignedTo}</td>
                <td className="px-6 py-4">{task.plant}</td>
                <td className="px-6 py-4">
                  <Badge variant={
                    task.status === 'Voltooid' ? 'success' : 
                    task.status === 'Bezig' ? 'info' : 
                    task.status === 'Geblokkeerd' ? 'danger' : 'neutral'
                  }>
                    {task.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    task.priority === 'Hoog' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Gemiddeld' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{task.dueDate}</td>
                <td className="px-6 py-4 text-xs text-slate-400 max-w-[150px] truncate" title={task.specifications}>
                  {task.specifications || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{task.timeAllocation || '-'}</td>
                <td className="px-2 py-4 text-right flex justify-end gap-2 w-[75px]">
                  <button 
                    onClick={() => handleEdit(task)}
                    className="text-slate-400 hover:text-secondary"
                    title="Bewerken"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)}
                    className="text-slate-400 hover:text-red-500"
                    title="Verwijderen"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Task Definition Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Taak bewerken" : "Nieuwe taak toevoegen"}
        className="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-600 flex items-start gap-2">
            <ClipboardList className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              Maak een gestandaardiseerde taakdefinitie aan die kan worden geïnstantieerd en toegewezen in de Cockpit.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Taaktitel
                {errors.title && <span className="text-red-500 text-xs ml-2">{errors.title}</span>}
              </label>
              <input 
                type="text" 
                value={formData.title || ''}
                onChange={e => {
                  setFormData({...formData, title: e.target.value});
                  if (errors.title) setErrors({...errors, title: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="bv. Veiligheidscontrole"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Toegewezen aan
                {errors.assignedTo && <span className="text-red-500 text-xs ml-2">{errors.assignedTo}</span>}
              </label>
              <input 
                type="text" 
                value={formData.assignedTo || ''}
                onChange={e => {
                  setFormData({...formData, assignedTo: e.target.value});
                  if (errors.assignedTo) setErrors({...errors, assignedTo: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${errors.assignedTo ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="bv. Jan Jansen of Team A"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={formData.status || 'In Wacht'}
                onChange={e => setFormData({...formData, status: e.target.value as Task['status']})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
              >
                <option value="In Wacht">In Wacht</option>
                <option value="Bezig">Bezig</option>
                <option value="Voltooid">Voltooid</option>
                <option value="Geblokkeerd">Geblokkeerd</option>
                <option value="Onnodig">Onnodig</option>
                <option value="Stopgezet">Stopgezet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categorie
                {errors.category && <span className="text-red-500 text-xs ml-2">{errors.category}</span>}
              </label>
              <select 
                value={formData.category || 'Onderhoud'}
                onChange={e => {
                  setFormData({...formData, category: e.target.value});
                  if (errors.category) setErrors({...errors, category: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
              >
                <option value="Onderhoud">Onderhoud</option>
                <option value="Inspectie">Inspectie</option>
                <option value="Logistiek">Logistiek</option>
                <option value="Beveiliging">Beveiliging</option>
                <option value="Administratie">Administratie</option>
                <option value="Andere">Andere</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prioriteit</label>
              <select 
                value={formData.priority || 'Gemiddeld'}
                onChange={e => setFormData({...formData, priority: e.target.value as Task['priority']})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
              >
                <option value="Laag">Laag</option>
                <option value="Gemiddeld">Gemiddeld</option>
                <option value="Hoog">Hoog</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tijdsduur
                {errors.timeAllocation && <span className="text-red-500 text-xs ml-2">{errors.timeAllocation}</span>}
              </label>
              <input 
                type="text" 
                value={formData.timeAllocation || ''}
                onChange={e => {
                  setFormData({...formData, timeAllocation: e.target.value});
                  if (errors.timeAllocation) setErrors({...errors, timeAllocation: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${errors.timeAllocation ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="bv. 2u"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Startdatum</label>
              <input 
                type="date" 
                value={formData.startDate || ''}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vervaldatum</label>
              <input 
                type="date" 
                value={formData.dueDate || ''}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fabriek
              {errors.plant && <span className="text-red-500 text-xs ml-2">{errors.plant}</span>}
            </label>
            <input 
              type="text" 
              value={formData.plant || ''}
              onChange={e => {
                setFormData({...formData, plant: e.target.value});
                if (errors.plant) setErrors({...errors, plant: ''});
              }}
              className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${errors.plant ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="bv. Fabriek A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Specificaties
              {errors.specifications && <span className="text-red-500 text-xs ml-2">{errors.specifications}</span>}
            </label>
            <textarea 
              value={formData.specifications || ''}
              onChange={e => {
                setFormData({...formData, specifications: e.target.value});
                if (errors.specifications) setErrors({...errors, specifications: ''});
              }}
              className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary ${errors.specifications ? 'border-red-500' : 'border-slate-300'}`}
              rows={3}
              placeholder="Gedetailleerde instructies..."
            />
          </div>

          <div className="pt-4 flex justify-center gap-2">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Annuleren
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg"
            >
              {editingTask ? 'Wijzigingen opslaan' : 'Taak aanmaken'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
