import React, { useState } from 'react';
import { UserPlus, Lock, Unlock, Edit } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ColumnHeader from '@/components/ui/ColumnHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useTableState } from '@/hooks/useTableState';
import { useToast } from '@/components/ui/Toast';

// Mock Data (will be moved to store later)
import { mockEmployees, Employee, mockTeams, mockPlants } from '@/data/mockData';
import TeamAssignment from '@/components/ui/TeamAssignment';

const EmployeesPage: React.FC = () => {
  const { 
    data: employees, 
    setData: setEmployees, 
    processedData: filteredEmployees,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  } = useTableState<Employee>(mockEmployees);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({ status: 'Beschikbaar' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLockConfirmOpen, setIsLockConfirmOpen] = useState(false);

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({ 
      status: 'Beschikbaar', 
      locked: false, 
      availability: 'Mon-Fri',
      contractType: 'Voltijds',
      gender: 'Andere',
      birthDate: '1990-01-01',
      joinDate: new Date().toISOString().split('T')[0],
    }); // Reset for new employee
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setErrors({});
    setIsModalOpen(true);
  };


  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'Moet ingevuld zijn!';
    if (!formData.lastName) newErrors.lastName = 'Moet ingevuld zijn!';
    if (!formData.birthDate) newErrors.birthDate = 'Moet ingevuld zijn!';
    if (!formData.email) newErrors.email = 'Moet ingevuld zijn!';
    if (!formData.phone) newErrors.phone = 'Moet ingevuld zijn!';
    if (!formData.role) newErrors.role = 'Moet ingevuld zijn!';
    if (!formData.plantId) newErrors.plantId = 'Moet ingevuld zijn!';
    // Team is optional now (can be unassigned)
    if (!formData.address) newErrors.address = 'Moet ingevuld zijn!';
    if (!formData.status) newErrors.status = 'Moet ingevuld zijn!';

    // Validation: Last Supervisor Check
    if (editingEmployee && editingEmployee.role === 'Supervisor') {
      // Check for teams where this user was a supervisor
      editingEmployee.teamIds.forEach(teamId => {
        // If user is no longer in this team OR no longer a supervisor
        const isStillSupervisorInTeam = formData.teamIds?.includes(teamId) && formData.role === 'Supervisor';
        
        if (!isStillSupervisorInTeam) {
          // Check if there are other supervisors in this team
          const otherSupervisors = employees.filter(e => 
            e.id !== editingEmployee.id && 
            e.teamIds.includes(teamId) && 
            e.role === 'Supervisor'
          );

          if (otherSupervisors.length === 0) {
            const teamName = mockTeams.find(t => t.id === teamId)?.name || `Team ${teamId}`;
            
            // Determine if it was a role change or team removal
            const isRoleChanged = formData.role !== editingEmployee.role;
            const isTeamRemoved = !formData.teamIds?.includes(teamId);

            if (isRoleChanged) {
              newErrors.role = `Kan rol niet wijzigen: Dit is de laatste supervisor voor ${teamName}.`;
            }
            
            if (isTeamRemoved) {
              newErrors.teamIds = `Kan team niet verlaten: Dit is de laatste supervisor voor ${teamName}.`;
            }
            
            // If neither (shouldn't happen if logic is correct, but fallback), or both
            if (!isRoleChanged && !isTeamRemoved) {
               // Maybe they tried to change something else but logic caught it? 
               // Or maybe they are still supervisor and still in team but something else triggered this?
               // The condition `!isStillSupervisorInTeam` implies one of them changed.
            }

            // Also add error to team assignment if possible, or just general error
            showToast(`Kan niet opslaan: ${teamName} heeft minimaal 1 supervisor nodig.`, 'error');
            
            // Revert changes to prevent UI from showing invalid state
            setFormData(prev => ({
              ...prev,
              role: editingEmployee.role,
              teamIds: editingEmployee.teamIds
            }));
          }
        }
      });
    }

    // Validation: Non-managers cannot have multiple teams
    if (formData.role !== 'Manager' && (formData.teamIds?.length || 0) > 1) {
       // Auto-fix or error? Let's error to be safe, though UI should prevent it.
       newErrors.teamIds = 'Alleen managers mogen meerdere teams hebben.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? { ...e, ...formData } as Employee : e));
      showToast('Werknemer succesvol bijgewerkt', 'success');
    } else {
      const newEmployee: Employee = {
        id: Math.floor(Math.random() * 1000) + 100,
        firstName: formData.firstName || 'Nieuw',
        lastName: formData.lastName || 'Gebruiker',
        role: formData.role || 'Werknemer',
        department: formData.department || 'Algemeen',
        status: formData.status || 'Beschikbaar',
        email: formData.email || '',
        phone: formData.phone || '',
        location: formData.location || 'Gent',
        birthDate: '1990-01-01', // Default
        gender: 'Andere', // Default
        contractType: 'Voltijds', // Default
        joinDate: new Date().toISOString().split('T')[0],
        availability: formData.availability || 'Ma-Vr',
        locked: false, // New employees are not locked by default
        teamIds: formData.teamIds || [],
        plantId: formData.plantId || 1, // Default to first plant if not selected
        address: formData.address || '',
      };
      setEmployees(prev => [...prev, newEmployee]);
      showToast('Werknemer succesvol aangemaakt', 'success');
    }
    setIsModalOpen(false);
  };

  const handleLockClick = () => {
    if (editingEmployee?.locked) {
      // Unlock immediately
      toggleLock(editingEmployee.id);
      // Update local state to reflect change immediately
      const updatedEmployee = { ...editingEmployee, locked: false, status: 'Beschikbaar' as const };
      setEditingEmployee(updatedEmployee);
      setFormData(prev => ({ ...prev, locked: false, status: 'Beschikbaar' }));
    } else {
      // Confirm before locking
      setIsLockConfirmOpen(true);
    }
  };

  const confirmLock = () => {
    if (editingEmployee) {
      toggleLock(editingEmployee.id);
      // Update local state to reflect change immediately
      const updatedEmployee = { 
        ...editingEmployee, 
        locked: true, 
        status: 'Locked' as const,
        role: 'Niet toegewezen' as const,
        teamIds: [],
        plantId: undefined
      };
      setEditingEmployee(updatedEmployee);
      setFormData(prev => ({ 
        ...prev, 
        locked: true, 
        status: 'Locked',
        role: 'Niet toegewezen',
        teamIds: [],
        plantId: undefined
      }));
      setIsLockConfirmOpen(false);
      // Do not close the modal
    }
  };

  const toggleLock = (id: number) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const newLocked = !emp.locked;
        if (newLocked) {
          showToast('Gebruiker succesvol geblokkeerd en losgekoppeld van rol, team en fabriek', 'success');
          return { 
            ...emp, 
            locked: true, 
            status: 'Locked',
            role: 'Niet toegewezen',
            teamIds: [],
            plantId: undefined
          };
        } else {
          showToast('Gebruiker succesvol gedeblokkeerd', 'success');
          return { ...emp, locked: false, status: 'Beschikbaar' };
        }
      }
      return emp;
    }));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Voornaam', 'Achternaam', 'Email', 'Telefoon', 'Rol', 'Afdeling', 'Team', 'Locatie', 'Adres', 'Beschikbaarheid', 'Status', 'Geblokkeerd', 'Geboortedatum', 'Geslacht', 'Contracttype', 'Datum indiensttreding'];
    const rows = employees.map(e => [
      e.id, e.firstName, e.lastName, e.email, e.phone, e.role, e.department, e.teamIds.map(tid => mockTeams.find(t => t.id === tid)?.name).join(', ') || 'Niet toegewezen', mockPlants.find(p => p.id === e.plantId)?.name || 'Niet toegewezen', e.location, e.address, e.availability, e.status, e.locked, e.birthDate, e.gender, e.contractType, e.joinDate
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'werknemers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
      <PageHeader 
        title="Werknemersbeheer"
        onExport={exportCSV}
        onAdd={handleAdd}
        addLabel="Toevoegen"
      />

      {/* Data Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <ColumnHeader<Employee> 
                columnKey="id"
                sortable 
                currentSort={sortConfig?.key === 'id' ? sortConfig.direction : null}
                onSort={(dir) => handleSort('id', dir)}
              >ID</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="lastName"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'lastName' ? sortConfig.direction : null}
                currentFilter={filters.lastName}
                onSort={(dir) => handleSort('lastName', dir)}
                onFilter={(val) => handleFilter('lastName', val)}
              >Naam</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="firstName"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'firstName' ? sortConfig.direction : null}
                currentFilter={filters.firstName}
                onSort={(dir) => handleSort('firstName', dir)}
                onFilter={(val) => handleFilter('firstName', val)}
              >Voornaam</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="birthDate"
                sortable 
                currentSort={sortConfig?.key === 'birthDate' ? sortConfig.direction : null}
                onSort={(dir) => handleSort('birthDate', dir)}
              >Geboortedatum</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="email" // Using email as key for contact info sorting for now
                sortable 
              >Contact Info</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="role"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Werknemer', 'Supervisor', 'Manager']}
                currentSort={sortConfig?.key === 'role' ? sortConfig.direction : null}
                currentFilter={filters.role}
                onSort={(dir) => handleSort('role', dir)}
                onFilter={(val) => handleFilter('role', val)}
              >Rol</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="teamIds"
                sortable={false} 
              >Teams</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="plantId"
                sortable 
                filterable 
                filterType="select"
                filterOptions={mockPlants.map(p => p.name)}
                currentSort={sortConfig?.key === 'plantId' ? sortConfig.direction : null}
                currentFilter={filters.plantId}
                onSort={(dir) => handleSort('plantId', dir)}
                onFilter={(val) => handleFilter('plantId', val)}
              >Fabriek</ColumnHeader>
              <ColumnHeader<Employee> 
                columnKey="status"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Beschikbaar', 'Ziek', 'Met Verlof', 'Locked']}
                currentSort={sortConfig?.key === 'status' ? sortConfig.direction : null}
                currentFilter={filters.status}
                onSort={(dir) => handleSort('status', dir)}
                onFilter={(val) => handleFilter('status', val)}
              >Beschikbaarheid</ColumnHeader>
              {/* Removed separate Contact and Availability columns as they are merged or renamed */}
              <ColumnHeader className="text-right w-[75px]">Acties</ColumnHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">{employee.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{employee.lastName}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{employee.firstName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{employee.birthDate}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">{employee.address}</span>
                    <span className="text-xs">{employee.phone}</span>
                    <span className="text-xs text-blue-600">{employee.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {employee.role === 'Niet toegewezen' ? (
                    <span className="text-slate-400 italic">Niet toegewezen</span>
                  ) : (
                    employee.role
                  )}
                </td>
                <td className="px-6 py-4">
                  {employee.teamIds.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {employee.teamIds.map(tid => (
                        <span key={tid} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {mockTeams.find(t => t.id === tid)?.name || tid}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Niet toegewezen</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {mockPlants.find(p => p.id === employee.plantId)?.name || <span className="text-slate-400 italic">Niet toegewezen</span>}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={
                    employee.status === 'Beschikbaar' ? 'success' : 
                    employee.status === 'Locked' ? 'neutral' : 'warning'
                  }>
                    {employee.status}
                  </Badge>
                </td>
                {/* Removed separate Contact and Availability cells */}
                <td className="p-4 text-right flex justify-end gap-2 w-[75px] px-2">
                  <button 
                    onClick={() => handleEdit(employee)}
                    className="text-slate-400 hover:text-secondary"
                    title="Bewerken"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between">
        <span>Toont {filteredEmployees.length} records</span>
        <span>Laatst gesynchroniseerd: Zojuist</span>
      </div>


      {/* Create/Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Werknemer bewerken" : "Nieuwe werknemer toevoegen"}
      >
        <div className="space-y-4">
          {editingEmployee ? null : (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 flex items-start gap-2">
              <UserPlus className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                Het toevoegen van een nieuwe werknemer maakt automatisch een gebruikersaccount aan en verstuurt een uitnodiging per e-mail.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Voornaam
                {errors.firstName && <span className="text-red-500 text-xs ml-2">{errors.firstName}</span>}
              </label>
              <input 
                type="text" 
                value={formData.firstName || ''}
                onChange={e => {
                  setFormData({...formData, firstName: e.target.value});
                  if (errors.firstName) setErrors({...errors, firstName: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.firstName ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Naam
                {errors.lastName && <span className="text-red-500 text-xs ml-2">{errors.lastName}</span>}
              </label>
              <input 
                type="text" 
                value={formData.lastName || ''}
                onChange={e => {
                  setFormData({...formData, lastName: e.target.value});
                  if (errors.lastName) setErrors({...errors, lastName: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.lastName ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Geboortedatum
              {errors.birthDate && <span className="text-red-500 text-xs ml-2">{errors.birthDate}</span>}
            </label>
            <input 
              type="date" 
              value={formData.birthDate || ''}
              onChange={e => {
                setFormData({...formData, birthDate: e.target.value});
                if (errors.birthDate) setErrors({...errors, birthDate: ''});
              }}
              className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.birthDate ? 'border-red-500' : 'border-slate-300'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
                {errors.email && <span className="text-red-500 text-xs ml-2">{errors.email}</span>}
              </label>
              <input 
                type="email" 
                value={formData.email || ''}
                onChange={e => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefoon
                {errors.phone && <span className="text-red-500 text-xs ml-2">{errors.phone}</span>}
              </label>
              <input 
                type="text" 
                value={formData.phone || ''}
                onChange={e => {
                  setFormData({...formData, phone: e.target.value});
                  if (errors.phone) setErrors({...errors, phone: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rol
                {errors.role && <span className="text-red-500 text-xs ml-2">{errors.role}</span>}
              </label>
              <select 
                value={formData.role || 'Werknemer'}
                onChange={e => {
                  setFormData({...formData, role: e.target.value as Employee['role']});
                  if (errors.role) setErrors({...errors, role: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.role ? 'border-red-500' : 'border-slate-300'} ${formData.locked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                disabled={formData.locked}
              >
                <option value="Werknemer">Werknemer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Manager">Manager</option>
                <option value="Niet toegewezen">Niet toegewezen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fabriek
                {errors.plantId && <span className="text-red-500 text-xs ml-2">{errors.plantId}</span>}
              </label>
              <select 
                value={formData.plantId || ''}
                onChange={e => {
                  setFormData({...formData, plantId: e.target.value ? parseInt(e.target.value) : undefined});
                  if (errors.plantId) setErrors({...errors, plantId: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.plantId ? 'border-red-500' : 'border-slate-300'} ${formData.locked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                disabled={formData.locked}
              >
                <option value="">Niet toegewezen</option>
                {mockPlants.map(plant => (
                  <option key={plant.id} value={plant.id}>{plant.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teams
                {errors.teamIds && <span className="text-red-500 text-xs ml-2">{errors.teamIds}</span>}
              </label>
              <TeamAssignment
                role={formData.role || 'Werknemer'}
                currentTeamIds={formData.teamIds || []}
                allTeams={mockTeams}
                onChange={(newTeamIds) => setFormData({...formData, teamIds: newTeamIds})}
                disabled={formData.locked}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adres
                {errors.address && <span className="text-red-500 text-xs ml-2">{errors.address}</span>}
              </label>
              <input 
                type="text" 
                value={formData.address || ''}
                onChange={e => {
                  setFormData({...formData, address: e.target.value});
                  if (errors.address) setErrors({...errors, address: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.address ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="bv. Straat 123, Stad"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Beschikbaarheid
                {errors.status && <span className="text-red-500 text-xs ml-2">{errors.status}</span>}
              </label>
              <select 
                value={formData.status || 'Beschikbaar'}
                onChange={e => {
                  setFormData({...formData, status: e.target.value as Employee['status']});
                  if (errors.status) setErrors({...errors, status: ''});
                }}
                className={`w-full border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.status ? 'border-red-500' : 'border-slate-300'} ${formData.locked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                disabled={formData.locked}
              >
                <option value="Beschikbaar">Beschikbaar</option>
                <option value="Ziek">Ziek</option>
                <option value="Met Verlof">Met Verlof</option>
                {formData.locked && <option value="Locked">Locked</option>}
              </select>
            </div>
              {/* Removed Location input as it is replaced by Plant/Address */}
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <div className="flex-1">
              {editingEmployee && editingEmployee.id !== 999 && (
                <button
                  onClick={handleLockClick}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                    editingEmployee.locked 
                      ? 'text-green-700 bg-green-50 hover:bg-green-100' 
                      : 'text-red-700 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  {editingEmployee.locked ? (
                    <>
                      <Unlock className="h-4 w-4" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Lock
                    </>
                  )}
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Annuleren
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-secondary hover:bg-secondary/90 rounded-lg"
            >
              {editingEmployee ? 'Wijzigingen opslaan' : 'Werknemer aanmaken'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={isLockConfirmOpen}
        onClose={() => setIsLockConfirmOpen(false)}
        onConfirm={confirmLock}
        title="Weet je het zeker?"
        message="Dit zal de gebruiker blokkeren en automatisch loskoppelen van hun rol, team en fabriek. Deze actie kan ongedaan worden gemaakt door de gebruiker te deblokkeren."
        confirmLabel="Lock"
        cancelLabel="Annuleren"
        variant="danger"
      />
    </div>
  );
};

export default EmployeesPage;
