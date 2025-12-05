import React, { useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import ColumnHeader from '@/components/ui/ColumnHeader';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useTableState } from '@/hooks/useTableState';
import { useToast } from '@/components/ui/Toast';

import { mockPlants, Plant } from '@/data/mockData';

const PlantsPage: React.FC = () => {
  const { 
    data: plants, 
    setData: setPlants, 
    processedData: filteredPlants,
    sortConfig,
    filters,
    handleSort,
    handleFilter
  } = useTableState<Plant>(mockPlants);

  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<number | null>(null);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState<Partial<Plant>>({ status: 'Operationeel', type: 'Productie' });

  const handleAdd = () => {
    setEditingPlant(null);
    setFormData({ status: 'Operationeel', type: 'Productie' });
    setIsModalOpen(true);
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setFormData(plant);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setPlantToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      setPlants(prev => prev.filter(p => p.id !== plantToDelete));
      showToast('Fabriek succesvol verwijderd', 'success');
      setPlantToDelete(null);
    }
  };

  const handleSave = () => {
    if (editingPlant) {
      setPlants(prev => prev.map(p => p.id === editingPlant.id ? { ...p, ...formData } as Plant : p));
      showToast('Fabriek succesvol bijgewerkt', 'success');
    } else {
      const newPlant: Plant = {
        id: Math.floor(Math.random() * 1000) + 100,
        name: formData.name || 'Nieuwe Fabriek',
        location: formData.location || 'Onbekend',
        type: formData.type || 'Productie',
        status: formData.status || 'Operationeel',
        capacity: formData.capacity || 0,
        managerId: formData.managerId || 0
      };
      setPlants(prev => [...prev, newPlant]);
      showToast('Fabriek succesvol toegevoegd', 'success');
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Naam', 'Locatie', 'Type', 'Status', 'Capaciteit', 'Manager ID'];
    const rows = plants.map(p => [
      p.id, p.name, p.location, p.type, p.status, p.capacity, p.managerId
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fabrieken.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 flex flex-col h-full">
      <PageHeader 
        title="Fabrieksbeheer"
        onExport={exportCSV}
        onAdd={handleAdd}
        addLabel="Toevoegen"
      />

      {/* Data Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 sticky top-0 z-10 shadow-sm">
            <tr>
              <ColumnHeader<Plant> 
                columnKey="name"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'name' ? sortConfig.direction : null}
                currentFilter={filters.name}
                onSort={(dir) => handleSort('name', dir)}
                onFilter={(val) => handleFilter('name', val)}
              >Fabrieksnaam</ColumnHeader>
              <ColumnHeader<Plant> 
                columnKey="location"
                sortable 
                filterable 
                currentSort={sortConfig?.key === 'location' ? sortConfig.direction : null}
                currentFilter={filters.location}
                onSort={(dir) => handleSort('location', dir)}
                onFilter={(val) => handleFilter('location', val)}
              >Locatie</ColumnHeader>
              <ColumnHeader<Plant> 
                columnKey="type"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Productie', 'Assemblage', 'Distributie', 'R&D']}
                currentSort={sortConfig?.key === 'type' ? sortConfig.direction : null}
                currentFilter={filters.type}
                onSort={(dir) => handleSort('type', dir)}
                onFilter={(val) => handleFilter('type', val)}
              >Type</ColumnHeader>
              <ColumnHeader<Plant> 
                columnKey="status"
                sortable 
                filterable 
                filterType="select"
                filterOptions={['Operationeel', 'Onderhoud', 'Offline']}
                currentSort={sortConfig?.key === 'status' ? sortConfig.direction : null}
                currentFilter={filters.status}
                onSort={(dir) => handleSort('status', dir)}
                onFilter={(val) => handleFilter('status', val)}
              >Status</ColumnHeader>
              <ColumnHeader<Plant> 
                columnKey="capacity"
                sortable 
                currentSort={sortConfig?.key === 'capacity' ? sortConfig.direction : null}
                onSort={(dir) => handleSort('capacity', dir)}
              >Capaciteit</ColumnHeader>
              <ColumnHeader<Plant> 
                columnKey="managerId"
                sortable 
                currentSort={sortConfig?.key === 'managerId' ? sortConfig.direction : null}
                onSort={(dir) => handleSort('managerId', dir)}
              >Manager ID</ColumnHeader>
              <ColumnHeader className="text-right w-[75px]">Acties</ColumnHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPlants.map((plant) => (
              <tr key={plant.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{plant.name}</td>
                <td className="px-6 py-4">{plant.location}</td>
                <td className="px-6 py-4">{plant.type}</td>
                <td className="px-6 py-4">
                  <Badge variant={
                    plant.status === 'Operationeel' ? 'success' : 
                    plant.status === 'Onderhoud' ? 'warning' : 'danger'
                  }>
                    {plant.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">{plant.capacity}%</td>
                <td className="px-6 py-4 text-sm text-slate-500">Manager ID: {plant.managerId}</td>
                <td className="px-2 py-4 text-right flex justify-end gap-2 w-[75px]">
                  <button 
                    onClick={() => handleEdit(plant)}
                    className="text-slate-400 hover:text-secondary"
                    title="Bewerken"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(plant.id)}
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
        title="Fabriek verwijderen"
        message="Weet u zeker dat u deze fabriek wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Verwijderen"
        variant="danger"
      />

      {/* Add/Edit Plant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlant ? "Fabriek bewerken" : "Nieuwe fabriek toevoegen"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fabrieksnaam</label>
            <input 
              type="text" 
              value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="bv. Gent Productie"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Locatie</label>
            <input 
              type="text" 
              value={formData.location || ''}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="bv. Gent, België"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select 
              value={formData.status || 'Operationeel'}
              onChange={e => setFormData({...formData, status: e.target.value as Plant['status']})}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
            >
              <option value="Operationeel">Operationeel</option>
              <option value="Onderhoud">Onderhoud</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
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
              {editingPlant ? 'Wijzigingen opslaan' : 'Fabriek aanmaken'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlantsPage;
