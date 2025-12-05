import React, { useState } from 'react';
import { Employee, Team, Task, Absence } from '../../data/mockData';
import TimelineRow from './TimelineRow';

interface TimelineProps {
  teams: Team[];
  employees: Employee[];
  tasks: Task[];
  absences?: Absence[];
  onDropTask: (taskId: number, entityId: number, type: 'Employee' | 'Team', date: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (entityId: number, type: 'Employee' | 'Team') => void;
  readOnly?: boolean; // New prop
}

const Timeline: React.FC<TimelineProps> = ({ teams, employees, tasks, absences = [], onDropTask, onTaskClick, onAddTask, readOnly = false }) => {
  const [startDate, setStartDate] = useState(new Date());
  // Initialize with all team IDs expanded
  const [expandedTeamIds, setExpandedTeamIds] = useState<Set<number>>(new Set(teams.map(t => t.id)));
  const daysToShow = 21; // 3 weeks

  const shiftTime = (days: number) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + days);
    setStartDate(newDate);
  };

  const dates = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-BE', { weekday: 'short', day: 'numeric', month: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const toggleTeam = (teamId: number) => {
    const newExpanded = new Set(expandedTeamIds);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeamIds(newExpanded);
  };

  const renderTeam = (team: Team, indent: number = 0) => {
    const isExpanded = expandedTeamIds.has(team.id);
    const hasChildren = team.members && team.members.length > 0;

    return (
      <React.Fragment key={`team-${team.id}`}>
        <TimelineRow
          entity={team}
          type="Team"
          tasks={tasks.filter(t => t.assignedToType === 'Team' && t.assignedToId === team.id)}
          startDate={startDate}
          daysToShow={daysToShow}
          onDropTask={onDropTask}
          onTaskClick={onTaskClick}
          onAddTask={onAddTask}
          indent={indent}
          isExpanded={isExpanded}
          onToggle={() => toggleTeam(team.id)}
          hasChildren={hasChildren}
          teamColor={team.color}
          readOnly={readOnly} // Pass readOnly
          hideNameColumn={readOnly} // Pass hideNameColumn
        />
        {isExpanded && (
          <>
            {/* Render Members */}
            {team.members.map(member => {
              const employee = employees.find(e => e.id === member.id);
              if (!employee) return null; // Should not happen if data is consistent
              
              const employeeAbsences = absences.filter(a => a.employeeName === `${employee.firstName} ${employee.lastName}`);

              return (
                <TimelineRow
                  key={`emp-${employee.id}`}
                  entity={employee}
                  type="Employee"
                  tasks={tasks.filter(t => t.assignedToType === 'Employee' && t.assignedToId === employee.id)}
                  absences={employeeAbsences}
                  startDate={startDate}
                  daysToShow={daysToShow}
                  onDropTask={onDropTask}
                  onTaskClick={onTaskClick}
                  onAddTask={onAddTask}
                  indent={indent + 1}
                  teamColor={team.color}
                  readOnly={readOnly} // Pass readOnly
                  hideNameColumn={readOnly} // Pass hideNameColumn
                />
              );
            })}
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Controls */}
      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <button onClick={() => shiftTime(-7)} className="p-1 hover:bg-gray-200 rounded">
            &lt;&lt; Week
          </button>
          <button onClick={() => shiftTime(-1)} className="p-1 hover:bg-gray-200 rounded">
            &lt; Dag
          </button>
          <span className="font-medium text-sm">
            {startDate.toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => shiftTime(1)} className="p-1 hover:bg-gray-200 rounded">
            Dag &gt;
          </button>
          <button onClick={() => shiftTime(7)} className="p-1 hover:bg-gray-200 rounded">
            Week &gt;&gt;
          </button>
          <button onClick={() => setStartDate(new Date())} className="text-xs text-blue-600 hover:underline ml-2">
            Vandaag
          </button>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-grow overflow-auto relative">
        <div className="min-w-max">
          {/* Sticky Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-30 shadow-sm">
            <div className="w-40 flex-shrink-0 p-2 border-r border-gray-200 font-semibold text-gray-700 bg-gray-50 z-40 sticky left-0">
              Personeel / Teams
            </div>
            <div className="flex flex-grow">
              {dates.map((date, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-24 p-2 text-center text-xs font-medium border-r border-gray-200 ${
                    isToday(date) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600'
                  }`}
                >
                  {formatDate(date)}
                </div>
              ))}
            </div>
          </div>

          {/* Body Rows */}
          {teams.length > 0 ? (
            teams.map(team => renderTeam(team))
          ) : (
            employees.map(employee => {
              const employeeAbsences = absences.filter(a => a.employeeName === `${employee.firstName} ${employee.lastName}` || a.employeeName === employee.firstName); // Check both full name and first name just in case
              
              return (
                <TimelineRow
                  key={`emp-${employee.id}`}
                  entity={employee}
                  type="Employee"
                  tasks={tasks.filter(t => t.assignedToType === 'Employee' && t.assignedToId === employee.id)}
                  absences={employeeAbsences}
                  startDate={startDate}
                  daysToShow={daysToShow}
                  onDropTask={onDropTask}
                  onTaskClick={onTaskClick}
                  onAddTask={onAddTask}
                  indent={0}
                  readOnly={readOnly}
                  hideNameColumn={readOnly}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
