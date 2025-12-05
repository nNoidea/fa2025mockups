import React from 'react';
import { Task } from '../../data/mockData';

interface TaskSidebarProps {
  tasks: Task[];
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ tasks }) => {
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  // Filter for unassigned tasks or tasks that need scheduling
  // For this POC, we'll show tasks that don't have a startDate set, OR are explicitly unassigned
  const unassignedTasks = tasks.filter(t => !t.startDate && !t.assignedToId);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 w-80 shadow-lg z-30">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-gray-800">Werkvoorraad</h2>
        <div className="text-xs text-gray-500 mt-1">Sleep taken naar de tijdlijn</div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {unassignedTasks.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            Geen openstaande taken
          </div>
        ) : (
          unassignedTasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow border-l-4 border-l-blue-500"
            >
              <div className="font-medium text-gray-900 text-sm">{task.title}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  task.priority === 'Hoog' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Gemiddeld' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-gray-400">{task.timeAllocation}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskSidebar;
