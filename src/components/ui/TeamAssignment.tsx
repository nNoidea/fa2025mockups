import React from 'react';
import { Plus, X, AlertCircle } from 'lucide-react';
import { Team } from '@/data/mockData';

interface TeamAssignmentProps {
  role: 'Manager' | 'Supervisor' | 'Werknemer' | 'Niet toegewezen';
  currentTeamIds: number[];
  allTeams: Team[];
  onChange: (teamIds: number[]) => void;
  disabled?: boolean;
}

const TeamAssignment: React.FC<TeamAssignmentProps> = ({
  role,
  currentTeamIds,
  allTeams,
  onChange,
  disabled = false
}) => {
  const isManager = role === 'Manager';

  const handleAddTeam = () => {
    // Find first available team that is not already selected
    const availableTeam = allTeams.find(t => !currentTeamIds.includes(t.id));
    if (availableTeam) {
      onChange([...currentTeamIds, availableTeam.id]);
    }
  };

  const handleRemoveTeam = (teamIdToRemove: number) => {
    onChange(currentTeamIds.filter(id => id !== teamIdToRemove));
  };

  const handleTeamChange = (index: number, newTeamId: number) => {
    const newTeamIds = [...currentTeamIds];
    // Check if this team is already selected in another slot
    if (currentTeamIds.some((id, i) => i !== index && id === newTeamId)) {
       // Ideally show error or just ignore. For now, let's just ignore or maybe swap?
       // Let's just update it. The parent or validation logic can handle duplicates if needed,
       // but here we can prevent selecting duplicates in the dropdown logic if we want.
    }
    newTeamIds[index] = newTeamId;
    onChange(newTeamIds);
  };

  // If not manager, force single team logic
  if (!isManager) {
    return (
      <div className="space-y-1">
        <select
          value={currentTeamIds[0] || ''}
          onChange={(e) => {
            const val = e.target.value ? parseInt(e.target.value) : undefined;
            onChange(val ? [val] : []);
          }}
          className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-slate-300 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          disabled={disabled}
        >
          <option value="">Niet toegewezen</option>
          {allTeams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        {currentTeamIds.length > 1 && (
           <div className="text-xs text-amber-600 flex items-center gap-1">
             <AlertCircle className="h-3 w-3" />
             <span>Let op: {role}s mogen maar aan 1 team toegewezen zijn. Andere teams worden verwijderd bij opslaan.</span>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentTeamIds.map((teamId, index) => (
        <div key={index} className="flex gap-2">
          <select
            value={teamId}
            onChange={(e) => handleTeamChange(index, parseInt(e.target.value))}
            className={`flex-1 border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 border-slate-300 ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            {allTeams.map(team => (
              <option 
                key={team.id} 
                value={team.id}
                disabled={currentTeamIds.includes(team.id) && team.id !== teamId} // Disable already selected teams
              >
                {team.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleRemoveTeam(teamId)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Team verwijderen"
            disabled={disabled}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
      
      {currentTeamIds.length < allTeams.length && (
        <button
          onClick={handleAddTeam}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-1"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Team toevoegen
        </button>
      )}
      
      {currentTeamIds.length === 0 && (
         <div className="text-sm text-slate-500 italic px-1">Geen teams toegewezen</div>
      )}
    </div>
  );
};

export default TeamAssignment;
