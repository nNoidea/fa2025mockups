import React, { useState } from 'react';
import { Search, Plus, Filter, Flag, Edit, Trash } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';

interface Task {
  id: string;
  name: string;
  category: string;
  priority: 'Laag' | 'Gemiddeld' | 'Hoog';
  assignedTo?: string;
  status: 'Open' | 'In Uitvoering' | 'Voltooid';
}

const initialTasks: Task[] = [
  { id: 'T-101', name: 'Lijn A Operatie', category: 'Productie', priority: 'Hoog', assignedTo: 'John Doe', status: 'In Uitvoering' },
  { id: 'T-102', name: 'Veiligheidsaudit', category: 'Veiligheid', priority: 'Gemiddeld', assignedTo: 'Jane Smith', status: 'Open' },
  { id: 'T-103', name: 'Apparatuur Controle', category: 'Onderhoud', priority: 'Laag', status: 'Voltooid' },
];

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ category: 'Productie', priority: 'Gemiddeld' });

  const handleCreateTask = () => {
    const task: Task = {
      id: `T-${Math.floor(Math.random() * 1000)}`,
      name: newTask.name || 'Nieuwe Taak',
      category: newTask.category || 'Productie',
      priority: newTask.priority || 'Gemiddeld',
      status: 'Open',
    };
    setTasks([...tasks, task]);
    setIsCreateModalOpen(false);
    setNewTask({ category: 'Productie', priority: 'Gemiddeld' });
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-end">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <label className="text-xs font-bold text-slate-500 uppercase">Zoeken</label>
            <div className="relative mt-1">
              <input 
                type="text" 
                placeholder="Zoek taken..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            <div className="relative mt-1">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md appearance-none bg-white">
                <option>Alle Statussen</option>
                <option>Open</option>
                <option>In Uitvoering</option>
                <option>Voltooid</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Taak Aanmaken
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
              <tr>
                <th className="px-6 py-3">Taaknaam</th>
                <th className="px-6 py-3">Categorie</th>
                <th className="px-6 py-3">Prioriteit</th>
                <th className="px-6 py-3">Toegewezen Aan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right w-[75px]">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{task.name}</div>
                    <div className="text-xs text-slate-400">{task.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral">{task.category}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 ${
                      task.priority === 'Hoog' ? 'text-red-600 font-bold' : 
                      task.priority === 'Gemiddeld' ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      <Flag className="h-3 w-3" /> {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {task.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{task.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Niet toegewezen</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      task.status === 'Open' ? 'info' : 
                      task.status === 'In Uitvoering' ? 'warning' : 'success'
                    }>
                      {task.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-slate-400 hover:text-secondary"><Edit className="h-4 w-4" /></button>
                      <button className="text-slate-400 hover:text-red-500"><Trash className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nieuwe Taak Aanmaken"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Taaknaam</label>
            <input 
              type="text" 
              value={newTask.name || ''}
              onChange={e => setNewTask({...newTask, name: e.target.value})}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:ring-secondary focus:border-secondary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Categorie</label>
            <select 
              value={newTask.category}
              onChange={e => setNewTask({...newTask, category: e.target.value})}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
            >
              <option>Productie</option>
              <option>Onderhoud</option>
              <option>Logistiek</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Prioriteit</label>
            <select 
              value={newTask.priority}
              onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
              className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
            >
              <option>Laag</option>
              <option>Gemiddeld</option>
              <option>Hoog</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium text-sm"
            >
              Annuleren
            </button>
            <button 
              onClick={handleCreateTask}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 font-medium text-sm shadow-sm"
            >
              Taak Aanmaken
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TasksPage;
