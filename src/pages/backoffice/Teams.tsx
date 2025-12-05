import React, { useState } from 'react';
import { UserPlus, Edit, Trash, Shield, User, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ColumnHeader from '@/components/ui/ColumnHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useTableState } from '@/hooks/useTableState';
import { useToast } from '@/components/ui/Toast';

import { mockTeams, Team, TeamMember } from '@/data/mockData';

const TeamsPage: React.FC = () => {
  const { 
    data: teams, 
    setData: setTeams, 
    processedData: filteredTeams,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  } = useTableState<Team>(mockTeams);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Team>>({ status: 'Actief', members: [] });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Supervisor' | 'Werknemer'>('Werknemer');

  const handleAdd = () => {
    setEditingTeam(null);
    setFormData({ status: 'Actief', members: [] });
    setNewMemberName('');
    setIsModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({ ...team });
    setNewMemberName('');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setTeamToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      setTeams(prev => prev.filter(t => t.id !== teamToDelete));
      showToast('Team succesvol verwijderd', 'success');
      setTeamToDelete(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.plant) {
      showToast('Vul alle verplichte velden in', 'error');
      return;
    }

    if (editingTeam) {
      setTeams(prev => prev.map(t => t.id === editingTeam.id ? { ...t, ...formData } as Team : t));
      showToast('Team succesvol bijgewerkt', 'success');
    } else {
      const newTeam: Team = {
        id: Math.floor(Math.random() * 1000) + 100,
        name: formData.name,
        plant: formData.plant,
        status: formData.status || 'Actief',
        members: formData.members || []
      };
      setTeams(prev => [...prev, newTeam]);
      showToast('Team succesvol aangemaakt', 'success');
    }
    setIsModalOpen(false);
  };

  const addMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name: newMemberName,
      role: newMemberRole
    };
    setFormData(prev => ({
      ...prev,
      members: [...(prev.members || []), newMember]
    }));
    setNewMemberName('');
  };

  const removeMember = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      members: (prev.members || []).filter(m => m.id !== memberId)
    }));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Naam', 'Fabriek', 'Aantal Leden', 'Status'];
    const rows = teams.map(t => [
      t.id, t.name, t.plant, t.members.length, t.status
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teams.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
      <PageHeader 
        title="Teambeheer"
        onExport={exportCSV}
        onAdd={handleAdd}
        addLabel="Team Aanmaken"
      />

      {/* Data Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
            <tr>
              <ColumnHeader<Team> 
                columnKey="name"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'name' ? sortConfig.direction : null}
                currentFilter={filters.name}
                onSort={(dir) => handleSort('name', dir)}
                onFilter={(val) => handleFilter('name', val)}
              >Teamnaam</ColumnHeader>
              <ColumnHeader<Team> 
                columnKey="plant"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'plant' ? sortConfig.direction : null}
                currentFilter={filters.plant}
                onSort={(dir) => handleSort('plant', dir)}
                onFilter={(val) => handleFilter('plant', val)}
              >Fabriek</ColumnHeader>
              <ColumnHeader className="w-1/3">Leden</ColumnHeader>
              <ColumnHeader<Team> 
                columnKey="status"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Actief', 'Inactief']}
                currentSort={sortConfig?.key === 'status' ? sortConfig.direction : null}
                currentFilter={filters.status}
                onSort={(dir) => handleSort('status', dir)}
                onFilter={(val) => handleFilter('status', val)}
              >Status</ColumnHeader>
              <ColumnHeader className="text-right w-[75px]">Acties</ColumnHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{team.name}</td>
                <td className="px-6 py-4">{team.plant}</td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2 overflow-hidden">
                    {team.members.slice(0, 5).map((member) => (
                      <div 
                        key={member.id} 
                        className={`inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-bold text-white ${member.role === 'Supervisor' ? 'bg-purple-600' : 'bg-slate-400'}`}
                        title={`${member.name} (${member.role})`}
                      >
                        {member.role === 'Supervisor' ? <Shield className="h-4 w-4" /> : member.name.charAt(0)}
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                        +{team.members.length - 5}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {team.members.filter(m => m.role === 'Supervisor').length} Supervisor(s), {team.members.filter(m => m.role === 'Werknemer').length} Werknemers
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={team.status === 'Actief' ? 'success' : 'neutral'}>
                    {team.status}
                  </Badge>
                </td>
                <td className="px-2 py-4 text-right flex justify-end gap-2 w-[75px]">
                  <button 
                    onClick={() => handleEdit(team)}
                    className="text-slate-400 hover:text-blue-600"
                    title="Bewerken"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(team.id)}
                    className="text-slate-400 hover:text-red-500"
                    title="Verwijderen"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Team verwijderen"
        message="Weet u zeker dat u dit team wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Team Verwijderen"
        variant="danger"
      />

      {/* Create/Edit Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeam ? "Team bewerken" : "Nieuw team aanmaken"}
        className="max-w-4xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Team Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2">Teamdetails</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teamnaam</label>
              <input 
                type="text" 
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="bv. Alpha Squad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fabriek / Locatie</label>
              <input 
                type="text" 
                value={formData.plant || ''}
                onChange={e => setFormData({...formData, plant: e.target.value})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="bv. Gent Hoofdgebouw"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select 
                value={formData.status || 'Actief'}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Actief">Actief</option>
                <option value="Inactief">Inactief</option>
              </select>
            </div>
          </div>

          {/* Right Column: Member Management */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-800 border-b pb-2">Teamleden</h4>
            
            {/* Add Member Form */}
            <div className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Naam</label>
                <input 
                  type="text" 
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                  placeholder="Naam nieuw lid"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-medium text-slate-500 mb-1">Rol</label>
                <select 
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                >
                  <option value="Werknemer">Werknemer</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
              <button 
                onClick={addMember}
                disabled={!newMemberName.trim()}
                className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="h-4 w-4" />
              </button>
            </div>

            {/* Members List */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-lg p-2 bg-slate-50">
              {formData.members?.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-4">Nog geen leden toegewezen.</div>
              )}
              {formData.members?.map(member => (
                <div key={member.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${member.role === 'Supervisor' ? 'bg-purple-600' : 'bg-slate-400'}`}>
                      {member.role === 'Supervisor' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.role}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeMember(member.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t mt-6">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Annuleren
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            {editingTeam ? 'Wijzigingen opslaan' : 'Team aanmaken'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TeamsPage;
