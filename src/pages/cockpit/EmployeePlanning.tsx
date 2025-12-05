import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Task, mockTasks, mockAbsence } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import TaskDetailModal from '../../components/ui/TaskDetailModal';

const EmployeePlanning: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to get the start of the week (Monday)
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  
  // Generate the 7 days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'numeric' });
  };

  const shiftWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Filter tasks for the logged-in employee
  const employeeTasks = mockTasks.filter(t => {
    const isAssigned = t.assignedToId === 998 || 
                       t.assignedTo === user?.name || 
                       t.assignedTo === user?.username;
    return isAssigned;
  });

  // Filter absences
  const employeeAbsences = mockAbsence.filter(a => 
    a.employeeName === user?.name || a.employeeName === user?.username || a.employeeName === 'Werknemer'
  );

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return employeeTasks.filter(task => {
      if (!task.startDate) return false;
      // For grid view, we primarily care about start date match
      return dateStr === task.startDate;
    });
  };

  const getAbsenceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return employeeAbsences.find(a => dateStr >= a.startDate && dateStr <= a.endDate);
  };

  // Time Grid Helpers
  const startHour = 8;
  const endHour = 17.5; // 17:30
  const totalHours = endHour - startHour;
  const pixelsPerHour = 60; // Height of one hour in pixels

  const getTopPosition = (startTime: string) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const timeInHours = hours + minutes / 60;
    return (timeInHours - startHour) * pixelsPerHour;
  };

  const getHeight = (timeAllocation: string) => {
    // Parse "2h", "1.5h", "30m" etc.
    let hours = 1; // Default
    if (timeAllocation.includes('h')) {
      hours = parseFloat(timeAllocation.replace('h', ''));
    } else if (timeAllocation.includes('m')) {
      hours = parseFloat(timeAllocation.replace('m', '')) / 60;
    }
    return hours * pixelsPerHour;
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-20 relative">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mijn Planning</h1>
          <p className="text-sm text-gray-500">Weekoverzicht (08:00 - 17:30)</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
          <button 
            onClick={() => shiftWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center px-4 font-medium text-gray-700 min-w-[200px] justify-center">
            <CalendarIcon size={18} className="mr-2 text-blue-600" />
            {formatShortDate(weekDays[0])} - {formatShortDate(weekDays[6])}
          </div>
          <button 
            onClick={() => shiftWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded-md transition-colors"
        >
          Vandaag
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-grow overflow-auto relative bg-white">
        <div className="flex min-w-[800px]">
          {/* Time Labels Column */}
          <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-white sticky left-0 z-10">
            <div className="h-12 border-b border-gray-100"></div> {/* Header spacer */}
            <div className="relative" style={{ height: `${totalHours * pixelsPerHour}px` }}>
              {Array.from({ length: Math.floor(totalHours) + 1 }, (_, i) => {
                const hour = startHour + i;
                return (
                  <div 
                    key={hour} 
                    className="absolute w-full text-right pr-2 text-xs text-gray-400 -mt-2"
                    style={{ top: `${i * pixelsPerHour}px` }}
                  >
                    {hour}:00
                  </div>
                );
              })}
            </div>
          </div>

          {/* Days Columns */}
          <div className="flex-grow grid grid-cols-7 divide-x divide-gray-100">
            {weekDays.map((date, index) => {
              const tasks = getTasksForDate(date);
              const absence = getAbsenceForDate(date);
              const isCurrentDay = isToday(date);

              return (
                <div key={index} className={`flex flex-col relative ${isCurrentDay ? 'bg-blue-50/10' : ''}`}>
                  {/* Day Header */}
                  <div className={`h-12 border-b border-gray-100 flex flex-col items-center justify-center sticky top-0 bg-white z-10 ${
                    isCurrentDay ? 'bg-blue-50 border-b-blue-200' : ''
                  }`}>
                    <span className={`text-xs font-bold uppercase ${isCurrentDay ? 'text-blue-600' : 'text-gray-500'}`}>
                      {date.toLocaleDateString('nl-BE', { weekday: 'short' })}
                    </span>
                    <span className={`text-sm font-bold ${isCurrentDay ? 'text-blue-700' : 'text-gray-800'}`}>
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Day Content (Grid) */}
                  <div className="relative w-full" style={{ height: `${totalHours * pixelsPerHour}px` }}>
                    
                    {/* Grid Lines */}
                    {Array.from({ length: Math.floor(totalHours) + 1 }, (_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-50"
                        style={{ top: `${i * pixelsPerHour}px` }}
                      />
                    ))}

                    {/* Lunch Break (12:00 - 12:30) */}
                    <div 
                      className="absolute w-full bg-stripes-yellow flex items-center justify-center border-y border-amber-200"
                      style={{ 
                        top: `${(12 - startHour) * pixelsPerHour}px`, 
                        height: `${0.5 * pixelsPerHour}px` 
                      }}
                    >
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-white/50 px-1 rounded">Lunch</span>
                    </div>

                    {/* Absence Overlay */}
                    {absence ? (
                      <div className={`absolute inset-0 m-1 rounded-lg flex flex-col items-center justify-center p-2 text-center z-20 ${
                        absence.type === 'Ziekte' ? 'bg-red-50/90 text-red-700 border border-red-100' : 'bg-orange-50/90 text-orange-700 border border-orange-100'
                      }`}>
                        <AlertCircle size={20} className="mb-1" />
                        <span className="font-bold text-sm">{absence.type}</span>
                        <span className="text-xs">{absence.reason}</span>
                      </div>
                    ) : (
                      /* Tasks */
                      tasks.map(task => {
                        if (!task.startTime) return null; // Skip if no start time
                        
                        const top = getTopPosition(task.startTime);
                        const height = getHeight(task.timeAllocation);

                        return (
                          <button
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            className={`absolute left-1 right-1 rounded-md border-l-4 shadow-sm hover:shadow-md transition-all p-1.5 text-left overflow-hidden group z-10 ${
                              task.priority === 'Hoog' ? 'border-l-red-500 bg-red-100 text-red-900' :
                              task.priority === 'Gemiddeld' ? 'border-l-blue-500 bg-blue-100 text-blue-900' :
                              'border-l-green-500 bg-green-100 text-green-900'
                            }`}
                            style={{ top: `${top}px`, height: `${height}px` }}
                          >
                            <div className="font-bold text-xs truncate leading-tight">
                              {task.title}
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 opacity-80">
                              <Clock size={10} />
                              <span className="text-[10px] font-medium leading-none">{task.startTime} - {task.timeAllocation}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />
      
      {/* CSS for stripes pattern */}
      <style>{`
        .bg-stripes-yellow {
          background-image: linear-gradient(45deg, #fef3c7 25%, transparent 25%, transparent 50%, #fef3c7 50%, #fef3c7 75%, transparent 75%, transparent);
          background-size: 10px 10px;
          background-color: #fffbeb; 
        }
      `}</style>
    </div>
  );
};

export default EmployeePlanning;
