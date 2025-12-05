import React, { useState, useEffect } from 'react';
import { Task } from '../../data/mockData';
import { X } from 'lucide-react';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
  onUnassign?: (task: Task) => void;
  canEdit: boolean;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({ isOpen, onClose, task, onSave, onUnassign, canEdit }) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setEditedTask(task);
    setErrors({});
  }, [task]);

  if (!isOpen || !editedTask) return null;

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    if (!editedTask) return false;
    const newErrors: { [key: string]: string } = {};
    if (!editedTask.title.trim()) newErrors.title = 'Titel is verplicht';
    if (!editedTask.category) newErrors.category = 'Categorie is verplicht';
    if (!editedTask.specifications.trim()) newErrors.specifications = 'Specificaties zijn verplicht';
    if (!editedTask.timeAllocation.trim()) newErrors.timeAllocation = 'Tijdsduur is verplicht';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTask) {
      if (!validateForm()) return;
      onSave(editedTask);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Taak Bewerken</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => handleChange('title', e.target.value)}
                disabled={!canEdit}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={!canEdit}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie <span className="text-red-500">*</span></label>
                <select
                  value={editedTask.category || 'Onderhoud'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  disabled={!canEdit}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Onderhoud">Onderhoud</option>
                  <option value="Inspectie">Inspectie</option>
                  <option value="Logistiek">Logistiek</option>
                  <option value="Beveiliging">Beveiliging</option>
                  <option value="Administratie">Administratie</option>
                  <option value="Andere">Andere</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specificaties <span className="text-red-500">*</span></label>
                <textarea
                  value={editedTask.specifications || ''}
                  onChange={(e) => handleChange('specifications', e.target.value)}
                  disabled={!canEdit}
                  rows={1}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.specifications ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.specifications && <p className="text-red-500 text-xs mt-1">{errors.specifications}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Datum <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={editedTask.startDate || ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  disabled={!canEdit}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eind Datum <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={editedTask.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={!canEdit}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
              </div>
            </div>
            
            {/* dueDate removed */}

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tijdsduur <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editedTask.timeAllocation}
                  onChange={(e) => handleChange('timeAllocation', e.target.value)}
                  disabled={!canEdit}
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.timeAllocation ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.timeAllocation && <p className="text-red-500 text-xs mt-1">{errors.timeAllocation}</p>}
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Prioriteit</label>
                 <select
                    value={editedTask.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    disabled={!canEdit}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                 >
                   <option value="Laag">Laag</option>
                   <option value="Gemiddeld">Gemiddeld</option>
                   <option value="Hoog">Hoog</option>
                 </select>
              </div>
            </div>

            {!canEdit && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                Je hebt geen rechten om deze taak te bewerken.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
            <div>
              {canEdit && editedTask?.assignedToId && (
                <button
                  type="button"
                  onClick={() => {
                    if (onUnassign) {
                      onUnassign(editedTask);
                      onClose();
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                >
                  Toewijzing ongedaan maken
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuleren
              </button>
              {canEdit && (
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Opslaan
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
