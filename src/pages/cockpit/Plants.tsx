import React, { useState } from 'react';
import { Factory, MapPin, ChevronRight, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import KPICard from '@/components/ui/KPICard';
import { cn } from '@/lib/utils';

interface Plant {
  id: number;
  name: string;
  location: string;
  status: 'Operationeel' | 'Waarschuwing' | 'Onderhoud';
  capacity: number;
  activeStaff: number;
  sickStaff: number;
}

const initialPlants: Plant[] = [
  { id: 1, name: 'Productie Gent', location: 'Gent, BE', status: 'Operationeel', capacity: 1200, activeStaff: 45, sickStaff: 2 },
  { id: 2, name: 'Assemblage Antwerpen', location: 'Antwerpen, BE', status: 'Waarschuwing', capacity: 850, activeStaff: 30, sickStaff: 5 },
  { id: 3, name: 'Logistiek Brussel', location: 'Brussel, BE', status: 'Operationeel', capacity: 2000, activeStaff: 80, sickStaff: 1 },
];

const PlantsPage: React.FC = () => {
  const [selectedPlantId, setSelectedPlantId] = useState<number>(1);
  const selectedPlant = initialPlants.find(p => p.id === selectedPlantId) || initialPlants[0];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
        
        {/* Plant List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">Beschikbare Fabrieken</h3>
            <span className="text-sm text-slate-500">{initialPlants.length} Locaties</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {initialPlants.map(plant => (
              <div 
                key={plant.id}
                onClick={() => setSelectedPlantId(plant.id)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between group",
                  selectedPlantId === plant.id 
                    ? "border-secondary bg-blue-50 ring-1 ring-secondary" 
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                    plant.status === 'Operationeel' ? "bg-green-500" : 
                    plant.status === 'Waarschuwing' ? "bg-orange-500" : "bg-slate-400"
                  )}>
                    <Factory className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{plant.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {plant.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-500">Capaciteit</div>
                    <div className="font-bold text-slate-700">{plant.capacity}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Details Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 overflow-y-auto custom-scrollbar">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Fabrieksdetails</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-2xl font-bold text-slate-800">{selectedPlant.name}</h4>
              <p className="text-slate-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {selectedPlant.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 uppercase font-bold">Status</div>
                <div className={cn("font-bold mt-1", 
                  selectedPlant.status === 'Operationeel' ? "text-green-600" : 
                  selectedPlant.status === 'Waarschuwing' ? "text-orange-500" : "text-slate-500"
                )}>
                  {selectedPlant.status}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 uppercase font-bold">Capaciteit</div>
                <div className="font-bold text-slate-800 mt-1">{selectedPlant.capacity}/dag</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Actief Personeel</span>
                <span className="font-bold text-slate-800">{selectedPlant.activeStaff}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-secondary h-2 rounded-full" 
                  style={{ width: `${(selectedPlant.activeStaff / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h5 className="font-bold text-sm text-slate-800 mb-3">Recente Problemen</h5>
              <div className="space-y-2">
                {selectedPlant.status !== 'Operationeel' ? (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>Operationele efficiëntie ligt onder het doel.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Alle systemen nominaal.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h5 className="font-bold text-sm text-slate-800 mb-3">Volledig Operationeel Rapport</h5>
              <div className="space-y-4 text-sm">
                <div>
                  <h6 className="font-bold text-slate-700 mb-1">Veiligheid & Incidenten</h6>
                  <p className="text-slate-600 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-100 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Geen veiligheidsincidenten gemeld deze week.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Taakvoltooiing" value="92%" trend="+4%" trendDirection="up" />
        <KPICard title="Tijdige Prestaties" value="85%" trend="-2%" trendDirection="down" />
        <KPICard title="Resourcebenutting" value="78%" trend="+1%" trendDirection="up" />
      </div>
    </div>
  );
};

export default PlantsPage;
