import React, { useState } from 'react';
import { Task } from '../../data/mockData';
import { X, Plus, Search } from 'lucide-react';

interface TaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: (taskId: number) => void;
  onCreateNew: () => void;
  tasks: Task[];
}

const TaskSelectionModal: React.FC<TaskSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectTask, 
  onCreateNew,
  tasks 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filter for unassigned tasks (Werkvoorraad)
  const unassignedTasks = tasks.filter(t => 
    !t.assignedToId && 
    !t.startDate && 
    (t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     t.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="font-semibold text-gray-800">Taak Toewijzen</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 flex-shrink-0 space-y-3">
          <button 
            onClick={onCreateNew}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center font-medium"
          >
            <Plus size={18} className="mr-2" />
            Nieuwe Taak Aanmaken
          </button>
          
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Zoek in werkvoorraad..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-2 flex-grow">
          {unassignedTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Geen taken gevonden in werkvoorraad.
            </div>
          ) : (
            unassignedTasks.map(task => (
              <div 
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="p-3 border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium text-gray-800 group-hover:text-blue-700">{task.title}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'Hoog' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Gemiddeld' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                  <span>{task.timeAllocation}</span>
                  <span>{task.plant}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskSelectionModal;
