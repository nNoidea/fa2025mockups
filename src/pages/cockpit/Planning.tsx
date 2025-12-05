import React, { useState } from 'react';
import { Plus, Briefcase, X } from 'lucide-react';
import EmployeePlanning from './EmployeePlanning';
import Timeline from '../../components/ui/Timeline';
import TaskEditModal from '../../components/ui/TaskEditModal';
import TaskCreationModal from '../../components/ui/TaskCreationModal';
import TaskSelectionModal from '../../components/ui/TaskSelectionModal';
import { mockEmployees, mockTeams, mockTasks, mockAbsence, Task, Employee } from '../../data/mockData';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

import { useToast } from '../../components/ui/Toast';

const PlanningPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [employees] = useState(mockEmployees);
  const [teams] = useState(mockTeams);
  const [absences] = useState(mockAbsence); // Add absences state
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskDefaults, setNewTaskDefaults] = useState<{ assignedToId?: number; assignedToType?: 'Employee' | 'Team'; assignedToName?: string }>({});

  // Helper to check if employee is absent on a specific date
  const isAbsent = (employeeId: number, dateStr: string) => {
    const absence = mockAbsence.find(a => {
      const emp = employees.find(e => e.id === employeeId);
      if (!emp) return false;
      const fullName = `${emp.firstName} ${emp.lastName}`;
      return a.employeeName === fullName;
    });

    if (!absence) return false;

    return dateStr >= absence.startDate && dateStr <= absence.endDate;
  };

  const isLocked = (employeeId: number) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp?.status === 'Locked' || emp?.locked;
  };

  const getDailyTaskCount = (employeeId: number, dateStr: string) => {
    return tasks.filter(t => 
      t.assignedToType === 'Employee' && 
      t.assignedToId === employeeId && 
      t.startDate && 
      t.startDate <= dateStr && 
      (t.endDate ? t.endDate >= dateStr : true)
    ).length;
  };

  const handleDropTask = (taskId: number, entityId: number, type: 'Employee' | 'Team', date: string) => {
    // Validation
    if (type === 'Employee') {
      if (isLocked(entityId)) {
        addNotification({
          title: 'Toewijzing Mislukt',
          message: 'Kan taak niet toewijzen: Medewerker is geblokkeerd.',
          time: 'Nu',
          type: 'alert'
        });
        showToast('Kan taak niet toewijzen: Medewerker is geblokkeerd.', 'error');
        return;
      }

      if (isAbsent(entityId, date)) {
        addNotification({
          title: 'Toewijzing Mislukt',
          message: 'Kan taak niet toewijzen: Medewerker is afwezig op deze datum.',
          time: 'Nu',
          type: 'alert'
        });
        showToast('Kan taak niet toewijzen: Medewerker is afwezig.', 'error');
        return;
      }

      if (getDailyTaskCount(entityId, date) >= 8) {
        addNotification({
          title: 'Toewijzing Mislukt',
          message: 'Kan taak niet toewijzen: Maximaal 8 taken per dag bereikt.',
          time: 'Nu',
          type: 'alert'
        });
        showToast('Kan taak niet toewijzen: Maximaal 8 taken per dag bereikt.', 'error');
        return;
      }
    }
    // No specific validation for Teams yet, but we allow it.

    // Update Task
    setTasks(prevTasks => {
      const task = prevTasks.find(t => t.id === taskId);
      if (!task) return prevTasks;

      const entity = type === 'Employee' 
        ? employees.find(e => e.id === entityId) 
        : teams.find(tm => tm.id === entityId);
      
      const entityName = type === 'Employee' 
        ? `${(entity as Employee).firstName} ${(entity as Employee).lastName}`
        : (entity as any).name;

      addNotification({
        title: 'Taak Toegewezen',
        message: `Taak "${task.title}" is toegewezen aan ${entityName} op ${date}.`,
        time: 'Nu',
        type: 'info'
      });
      // Optional: show success toast for assignment? Maybe too noisy.

      return prevTasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            assignedToId: entityId,
            assignedToType: type,
            assignedTo: entityName,
            startDate: date,
            endDate: date, // Default to 1 day for drag-drop
            status: 'Bezig'
          };
        }
        return t;
      });
    });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleAddTaskClick = (entityId: number, type: 'Employee' | 'Team') => {
    const entity = type === 'Employee' 
      ? employees.find(e => e.id === entityId) 
      : teams.find(tm => tm.id === entityId);
    
    const entityName = type === 'Employee' 
      ? `${(entity as Employee).firstName} ${(entity as Employee).lastName}`
      : (entity as any).name;

    setNewTaskDefaults({
      assignedToId: entityId,
      assignedToType: type,
      assignedToName: entityName
    });
    setIsSelectionModalOpen(true);
  };

  const handleSelectTask = (taskId: number) => {
    const date = new Date().toISOString().split('T')[0]; // Default to today
    if (newTaskDefaults.assignedToId && newTaskDefaults.assignedToType) {
      handleDropTask(taskId, newTaskDefaults.assignedToId, newTaskDefaults.assignedToType, date);
      setIsSelectionModalOpen(false);
    }
  };

  const handleCreateNewFromSelection = () => {
    setIsSelectionModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    addNotification({
      title: 'Taak Bijgewerkt',
      message: `Taak "${updatedTask.title}" is succesvol bijgewerkt.`,
      time: 'Nu',
      type: 'info'
    });
    showToast('Taak succesvol bijgewerkt', 'success');
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id'>) => {
    const newId = Math.max(...tasks.map(t => t.id)) + 1;
    const newTask: Task = { ...newTaskData, id: newId };
    
    // Validate before adding if assigned to employee
    if (newTask.assignedToType === 'Employee' && newTask.assignedToId && newTask.startDate) {
       if (isLocked(newTask.assignedToId)) {
        addNotification({ title: 'Fout', message: 'Medewerker is geblokkeerd.', type: 'alert', time: 'Nu' });
        showToast('Medewerker is geblokkeerd.', 'error');
        return;
       }
       if (isAbsent(newTask.assignedToId, newTask.startDate)) {
         addNotification({ title: 'Fout', message: 'Medewerker is afwezig.', type: 'alert', time: 'Nu' });
         showToast('Medewerker is afwezig.', 'error');
         return;
       }
       if (getDailyTaskCount(newTask.assignedToId, newTask.startDate) >= 8) {
         addNotification({ title: 'Fout', message: 'Max taken bereikt.', type: 'alert', time: 'Nu' });
         showToast('Maximaal 8 taken per dag bereikt.', 'error');
         return;
       }
    }

    setTasks(prev => [...prev, newTask]);
    addNotification({
      title: 'Taak Aangemaakt',
      message: `Taak "${newTask.title}" is succesvol aangemaakt.`,
      time: 'Nu',
      type: 'info'
    });
    showToast('Taak succesvol aangemaakt', 'success');
  };

  const handleUnassignTask = (taskToUnassign: Task) => {
    setTasks(prevTasks => prevTasks.map(t => {
      if (t.id === taskToUnassign.id) {
        return {
          ...t,
          assignedToId: undefined,
          assignedToType: undefined,
          assignedTo: undefined,
          startDate: undefined,
          endDate: undefined,
          status: 'In Wacht'
        };
      }
      return t;
    }));
    addNotification({
      title: 'Toewijzing Ongedaan Gemaakt',
      message: `Taak "${taskToUnassign.title}" is teruggezet naar werkvoorraad.`,
      time: 'Nu',
      type: 'info'
    });
  };

  // Filter data based on user role
  const isEmployee = user?.role === 'Werknemer';
  
  if (isEmployee) {
    return <EmployeePlanning />;
  }

  const displayedEmployees = employees;
  const displayedTeams = teams;

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Planning Dashboard</h1>
          <p className="text-sm text-gray-500">Beheer taken en personeelstoewijzingen</p>
        </div>
        {!isEmployee && (
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nieuwe Taak
            </button>
          </div>
        )}
      </div>

      {/* Timeline Area */}
      <div className="flex-grow overflow-hidden relative">
        <Timeline 
          teams={displayedTeams} 
          employees={displayedEmployees} 
          tasks={tasks}
          absences={absences}
          onDropTask={handleDropTask}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTaskClick}
          readOnly={isEmployee} // Disable editing for employees
        />
      </div>

      {/* Bottom Panel: Unassigned Tasks - Hide for Employees */}
      {!isEmployee && (
        <div className="h-64 bg-gray-50 border-t border-gray-200 flex flex-col">
          <div className="px-6 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <Briefcase size={18} className="mr-2" />
              Werkvoorraad (Niet toegewezen)
            </h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              {tasks.filter(t => !t.assignedToId).length} taken
            </span>
          </div>
          <div className="flex-grow overflow-x-auto p-4">
            <div className="flex space-x-4 min-w-max pb-2">
              {tasks.filter(t => !t.assignedToId).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', task.id.toString());
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => handleTaskClick(task)}
                    className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing border-l-4 border-l-blue-500 transition-all"
                  >
                    <div className="font-medium text-gray-900 text-sm truncate">{task.title}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</div>
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <span className={`px-1.5 py-0.5 rounded ${
                        task.priority === 'Hoog' ? 'bg-red-100 text-red-600' :
                        task.priority === 'Gemiddeld' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      } mr-2`}>
                        {task.priority}
                      </span>
                      <span>{task.timeAllocation}</span>
                    </div>
                  </div>
              ))}
              {tasks.filter(t => !t.assignedToId).length === 0 && (
                <div className="text-gray-400 text-sm italic p-4">
                  Geen openstaande taken.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
        onUnassign={handleUnassignTask}
        canEdit={!isEmployee} // Employees cannot edit
      />
      
      <TaskCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTask}
        initialAssignedToId={newTaskDefaults.assignedToId}
        initialAssignedToType={newTaskDefaults.assignedToType}
        initialAssignedToName={newTaskDefaults.assignedToName}
      />

      <TaskSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onSelectTask={handleSelectTask}
        onCreateNew={handleCreateNewFromSelection}
        tasks={tasks}
      />
    </div>
  );
};

export default PlanningPage;
