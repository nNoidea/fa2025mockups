import React from 'react';
import { X, Clock, MapPin, FileText } from 'lucide-react';
import { Task } from '../../data/mockData';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-start border-b ${
          task.priority === 'Hoog' ? 'bg-red-50 border-red-100' :
          task.priority === 'Gemiddeld' ? 'bg-blue-50 border-blue-100' :
          'bg-green-50 border-green-100'
        }`}>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                task.priority === 'Hoog' ? 'bg-red-100 text-red-700' :
                task.priority === 'Gemiddeld' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
              <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-white rounded-full border border-gray-200">
                {task.category}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-white/50 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Time Allocation */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Tijdsduur</h3>
              <p className="text-gray-600">{task.timeAllocation}</p>
              {task.startTime && (
                <p className="text-xs text-gray-400 mt-0.5">Starttijd: {task.startTime}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Locatie</h3>
              <p className="text-gray-600">{task.plant}</p>
            </div>
          </div>

          {/* Specifications */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Instructies</h3>
              <p className="text-gray-600 leading-relaxed">{task.specifications}</p>
            </div>
          </div>

          {/* Description (if any) */}
          {task.description && (
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 italic border border-gray-100">
              "{task.description}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
