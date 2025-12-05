import React, { useState } from 'react';
import { Employee, Team, Task, Absence } from '../../data/mockData';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';

interface TimelineRowProps {
  entity: Employee | Team;
  type: 'Employee' | 'Team';
  tasks: Task[];
  absences?: Absence[];
  startDate: Date;
  daysToShow: number;
  onDropTask: (taskId: number, entityId: number, type: 'Employee' | 'Team', date: string) => void;
  onTaskClick?: (task: Task) => void;
  onAddTask?: (entityId: number, type: 'Employee' | 'Team') => void;
  indent?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  hasChildren?: boolean;
  teamColor?: string;
  readOnly?: boolean;
  hideNameColumn?: boolean; // New prop
}

const TimelineRow: React.FC<TimelineRowProps> = ({ 
  entity, 
  type, 
  tasks, 
  absences = [],
  startDate, 
  daysToShow, 
  onDropTask,
  onTaskClick,
  onAddTask,
  indent = 0,
  isExpanded = false,
  onToggle,
  hasChildren = false,
  teamColor,
  readOnly = false,
  hideNameColumn = false // Default to false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) return; // Disable drag over
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    if (readOnly) return; // Disable drop
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'));
    if (taskId) {
      onDropTask(taskId, entity.id, type, date.toISOString().split('T')[0]);
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div 
      className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Name Column - Conditionally rendered */}
      {!hideNameColumn && (
        <div 
          className="w-40 flex-shrink-0 p-2 border-r border-gray-200 bg-white z-20 flex items-center sticky left-0 justify-between"
          style={{ 
            borderLeft: teamColor ? `4px solid ${teamColor}` : '4px solid transparent',
            paddingLeft: '8px'
          }}
        >
          <div className="flex items-center overflow-hidden">
            {hasChildren && (
              <button 
                onClick={onToggle}
                className="mr-2 p-1 hover:bg-gray-100 rounded text-gray-500"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            {!hasChildren && indent > 0 && <div className="w-6 mr-2" />} {/* Spacer for alignment */}
            
            <div className="flex flex-col overflow-hidden">
              <div className={`font-medium truncate ${type === 'Team' ? 'text-gray-800' : 'text-gray-600 text-sm'} ${
                type === 'Employee' && (entity as Employee).id === 999 ? 'text-green-600 font-bold' : ''
              }`}>
                {type === 'Team' ? (entity as Team).name : `${(entity as Employee).firstName} ${(entity as Employee).lastName}`.trim()}
                {type === 'Employee' && (entity as Employee).id === 999 && <span className="text-xs ml-1 text-green-500 font-normal">(Jij)</span>}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {type === 'Team' ? `${(entity as Team).members.length} Leden` : (entity as Employee).role}
              </div>
            </div>
          </div>

          {/* Add Task Button - Visible on Hover */}
          {onAddTask && !readOnly && ( // Hide if readOnly
            <button
              onClick={() => onAddTask(entity.id, type)}
              className={`p-1 rounded-full hover:bg-blue-100 text-blue-600 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              title="Nieuwe taak toevoegen"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      )}

      {/* Timeline Cells */}
      <div className="flex flex-grow">
        {dates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          
          // Check for absence
          const absence = absences.find(a => 
            dateStr >= a.startDate && dateStr <= a.endDate
          );

          const dayTasks = tasks.filter(task => {
            if (!task.startDate) return false;
            if (task.endDate) {
              return dateStr >= task.startDate && dateStr <= task.endDate;
            } else {
              return dateStr >= task.startDate;
            }
          });

          return (
            <div
              key={index}
              className={`flex-shrink-0 w-24 border-r border-gray-100 p-1 relative ${isWeekend(date) ? 'bg-gray-50' : ''} ${absence ? 'bg-slate-50' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              {absence ? (
                <div className={`h-full w-full rounded flex items-center justify-center text-xs font-bold opacity-80 ${
                  absence.type === 'Ziekte' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {absence.type === 'Ziekte' ? 'ZIEK' : 'VERLOF'}
                </div>
              ) : (
                dayTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={(e) => { e.stopPropagation(); onTaskClick && onTaskClick(task); }}
                    className={`text-xs px-2 py-1 mb-1 rounded-md truncate cursor-pointer shadow-sm transition-all hover:shadow-md ${
                      task.priority === 'Hoog' ? 'bg-red-500 text-white' :
                      task.priority === 'Gemiddeld' ? 'bg-blue-500 text-white' :
                      'bg-green-500 text-white'
                    }`}
                    title={`${task.title} (${task.timeAllocation})`}
                  >
                    {task.title}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineRow;
