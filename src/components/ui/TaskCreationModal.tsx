import React, { useState } from 'react';
import { Task } from '../../data/mockData';
import { X } from 'lucide-react';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTask: Omit<Task, 'id'>) => void;
  initialAssignedToId?: number;
  initialAssignedToType?: 'Employee' | 'Team';
  initialAssignedToName?: string;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialAssignedToId, 
  initialAssignedToType,
  initialAssignedToName
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Onderhoud');
  const [specifications, setSpecifications] = useState('');
  const [priority, setPriority] = useState<'Laag' | 'Gemiddeld' | 'Hoog'>('Gemiddeld');
  const [timeAllocation, setTimeAllocation] = useState('1h');
  const [plant, setPlant] = useState('Gent Hoofdvestiging');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // dueDate removed

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Titel is verplicht';
    if (!category) newErrors.category = 'Categorie is verplicht';
    if (!specifications.trim()) newErrors.specifications = 'Specificaties zijn verplicht';
    if (!timeAllocation.trim()) newErrors.timeAllocation = 'Tijdsduur is verplicht';
    if (!plant) newErrors.plant = 'Plant is verplicht';
    if (!startDate) newErrors.startDate = 'Startdatum is verplicht';
    if (!endDate) newErrors.endDate = 'Einddatum is verplicht';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      description,
      category,
      priority,
      timeAllocation,
      plant,
      status: 'In Wacht',
      specifications,
      assignedToId: initialAssignedToId,
      assignedToType: initialAssignedToType,
      assignedTo: initialAssignedToName,
      startDate: startDate,
      endDate: endDate,
      // dueDate removed
    };
    onSave(newTask);
    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Onderhoud');
    setSpecifications('');
    setPriority('Gemiddeld');
    setStartDate('');
    setEndDate('');
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Nieuwe Taak Toevoegen</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {initialAssignedToName && (
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-100">
              Wordt toegewezen aan: <span className="font-semibold">{initialAssignedToName}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Bijv. Onderhoud Generator"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categorie <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors({ ...errors, category: '' });
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschrijving</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specificaties <span className="text-red-500">*</span></label>
            <textarea
              value={specifications}
              onChange={(e) => {
                setSpecifications(e.target.value);
                if (errors.specifications) setErrors({ ...errors, specifications: '' });
              }}
              rows={2}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.specifications ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Verplichte specificaties..."
            />
            {errors.specifications && <p className="text-red-500 text-xs mt-1">{errors.specifications}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tijdsduur <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={timeAllocation}
                onChange={(e) => {
                  setTimeAllocation(e.target.value);
                  if (errors.timeAllocation) setErrors({ ...errors, timeAllocation: '' });
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.timeAllocation ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.timeAllocation && <p className="text-red-500 text-xs mt-1">{errors.timeAllocation}</p>}
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Prioriteit</label>
               <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <option value="Laag">Laag</option>
                 <option value="Gemiddeld">Gemiddeld</option>
                 <option value="Hoog">Hoog</option>
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plant <span className="text-red-500">*</span></label>
            <select
              value={plant}
              onChange={(e) => {
                setPlant(e.target.value);
                if (errors.plant) setErrors({ ...errors, plant: '' });
              }}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.plant ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="Gent Hoofdvestiging">Gent Hoofdvestiging</option>
              <option value="Antwerpen Haven">Antwerpen Haven</option>
              <option value="Brussel R&D">Brussel R&D</option>
            </select>
            {errors.plant && <p className="text-red-500 text-xs mt-1">{errors.plant}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Datum <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) setErrors({ ...errors, startDate: '' });
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eind Datum <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (errors.endDate) setErrors({ ...errors, endDate: '' });
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded mr-2"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Aanmaken
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;
