
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'Man' | 'Vrouw' | 'Andere';
  location: string;
  role: 'Manager' | 'Supervisor' | 'Werknemer' | 'Niet toegewezen';
  email: string;
  phone: string;
  contractType: 'Voltijds' | 'Deeltijds' | 'Freelance';
  status: 'Beschikbaar' | 'Ziek' | 'Met Verlof' | 'Locked';
  joinDate: string;
  department: string;
  availability: string;
  locked?: boolean;
  teamIds: number[];
  plantId?: number;
  address?: string;
}

export interface Plant {
  id: number;
  name: string;
  location: string;
  type: 'Productie' | 'Assemblage' | 'Distributie' | 'R&D';
  status: 'Operationeel' | 'Onderhoud' | 'Offline';
  capacity: number;
  managerId: number;
}

export interface TeamMember {
  id: number;
  name: string;
  role: 'Supervisor' | 'Werknemer' | 'Team Lead' | 'Operator' | 'Manager';
}

export interface Team {
  id: number;
  name: string;
  plant: string;
  members: TeamMember[];
  status: 'Actief' | 'Inactief';
  color?: string; // Hex code or Tailwind class
}

export interface Absence {
  id: number;
  employeeName: string;
  type: 'Ziekte' | 'Verlof' | 'Persoonlijk' | 'Ouderschapsverlof';
  startDate: string;
  endDate: string;
  status: 'In Behandeling' | 'Goedgekeurd' | 'Geweigerd';
  reason?: string;
}

export const mockEmployees: Employee[] = [
  {
    id: 999,
    firstName: 'Almighty',
    lastName: 'Manager',
    birthDate: '1985-01-01',
    gender: 'Man',
    location: 'Gent',
    role: 'Manager',
    email: 'manager@company.com',
    phone: '+32 470 00 00 00',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2010-01-01',
    department: 'Management',
    availability: 'Ma-Vr',
    teamIds: [1],
    plantId: 1,
    address: 'Kantoor'
  },
  {
    id: 101,
    firstName: 'Joel',
    lastName: 'Miller',
    birthDate: '1981-09-26',
    gender: 'Man',
    location: 'Gent',
    role: 'Manager',
    email: 'joel.miller@company.com',
    phone: '+32 470 12 34 56',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2013-09-26',
    department: 'Operations',
    availability: 'Ma-Vr',
    teamIds: [1],
    plantId: 1,
    address: 'Kouter 1, 9000 Gent'
  },
  {
    id: 102,
    firstName: 'Ellie',
    lastName: 'Williams',
    birthDate: '2004-04-12',
    gender: 'Vrouw',
    location: 'Antwerpen',
    role: 'Supervisor',
    email: 'ellie.williams@company.com',
    phone: '+32 470 98 76 54',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2019-07-15',
    department: 'Logistics',
    availability: 'Ma-Vr',
    teamIds: [2],
    plantId: 2,
    address: 'Meir 23, 2000 Antwerpen'
  },
  {
    id: 103,
    firstName: 'Tommy',
    lastName: 'Miller',
    birthDate: '1985-11-05',
    gender: 'Man',
    location: 'Gent',
    role: 'Supervisor',
    email: 'tommy.miller@company.com',
    phone: '+32 470 11 22 33',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2015-01-10',
    department: 'Assembly',
    availability: 'Shift A',
    teamIds: [1],
    plantId: 1,
    address: 'Veldstraat 45, 9000 Gent'
  },
  {
    id: 104,
    firstName: 'Tess',
    lastName: 'Servopoulos',
    birthDate: '1978-02-29',
    gender: 'Vrouw',
    location: 'Brussel',
    role: 'Manager',
    email: 'tess.servopoulos@company.com',
    phone: '+32 470 44 55 66',
    contractType: 'Voltijds',
    status: 'Met Verlof',
    joinDate: '2010-05-20',
    department: 'Security',
    availability: 'Shift B',
    teamIds: [1],
    plantId: 1,
    address: 'Nieuwstraat 10, 1000 Brussel'
  },
  {
    id: 105,
    firstName: 'Arthur',
    lastName: 'Morgan',
    birthDate: '1863-06-18',
    gender: 'Man',
    location: 'Antwerpen',
    role: 'Werknemer',
    email: 'arthur.morgan@company.com',
    phone: '+32 470 77 88 99',
    contractType: 'Deeltijds',
    status: 'Beschikbaar',
    joinDate: '1899-09-01',
    department: 'Logistics',
    availability: 'Weekends',
    teamIds: [2],
    plantId: 2,
    address: 'Keyserlei 5, 2000 Antwerpen'
  },
  {
    id: 106,
    firstName: 'Marlene',
    lastName: 'Dandridge',
    birthDate: '1975-01-15',
    gender: 'Vrouw',
    location: 'Gent',
    role: 'Manager',
    email: 'marlene@company.com',
    phone: '+32 470 22 33 44',
    contractType: 'Voltijds',
    status: 'Ziek',
    joinDate: '2011-11-12',
    department: 'Operations',
    availability: 'Shift A',
    teamIds: [3],
    plantId: 3,
    address: 'Korenmarkt 7, 9000 Gent'
  },
  {
    id: 107,
    firstName: 'Abby',
    lastName: 'Anderson',
    birthDate: '1998-04-04',
    gender: 'Vrouw',
    location: 'Brussel',
    role: 'Supervisor',
    email: 'abby.anderson@company.com',
    phone: '+32 470 55 66 77',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2018-02-28',
    department: 'Security',
    availability: 'Ma-Vr',
    teamIds: [3],
    plantId: 3,
    address: 'Louizalaan 50, 1050 Brussel'
  },
  {
    id: 108,
    firstName: 'Nathan',
    lastName: 'Drake',
    birthDate: '1976-06-13',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'nathan.drake@company.com',
    phone: '+32 470 88 99 00',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2014-08-05',
    department: 'Logistics',
    availability: 'Shift B',
    teamIds: [3],
    plantId: 1,
    address: 'Vrijdagmarkt 12, 9000 Gent'
  },
  {
    id: 109,
    firstName: 'Lara',
    lastName: 'Croft',
    birthDate: '1992-02-14',
    gender: 'Vrouw',
    location: 'Antwerpen',
    role: 'Werknemer',
    email: 'lara.croft@company.com',
    phone: '+32 470 12 13 14',
    contractType: 'Freelance',
    status: 'Locked',
    joinDate: '2022-03-15',
    department: 'Quality Control',
    availability: 'Flexibel',
    teamIds: [],
    plantId: undefined,
    address: 'Groenplaats 8, 2000 Antwerpen',
    locked: true
  },
  {
    id: 110,
    firstName: 'Solid',
    lastName: 'Snake',
    birthDate: '1972-06-01',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'solid.snake@company.com',
    phone: '+32 470 15 16 17',
    contractType: 'Deeltijds',
    status: 'Beschikbaar',
    joinDate: '2005-01-10',
    department: 'Security',
    availability: 'Ma-Wo',
    teamIds: [3],
    plantId: 1,
    address: 'Overpoortstraat 99, 9000 Gent'
  },
  {
    id: 111,
    firstName: 'Geralt',
    lastName: 'of Rivia',
    birthDate: '1168-01-01',
    gender: 'Man',
    location: 'Brussel',
    role: 'Werknemer',
    email: 'geralt@company.com',
    phone: '+32 470 66 77 88',
    contractType: 'Freelance',
    status: 'Beschikbaar',
    joinDate: '2015-05-19',
    department: 'Operations',
    availability: 'Flexibel',
    teamIds: [1],
    plantId: 3,
    address: 'Grote Markt 1, 1000 Brussel'
  },
  {
    id: 112,
    firstName: 'Cloud',
    lastName: 'Strife',
    birthDate: '1986-08-11',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'cloud.strife@company.com',
    phone: '+32 470 99 00 11',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '1997-01-31',
    department: 'Security',
    availability: 'Shift A',
    teamIds: [1],
    plantId: 1,
    address: 'Korenlei 10, 9000 Gent'
  },
  {
    id: 113,
    firstName: 'Tifa',
    lastName: 'Lockhart',
    birthDate: '1987-05-03',
    gender: 'Vrouw',
    location: 'Gent',
    role: 'Werknemer',
    email: 'tifa.lockhart@company.com',
    phone: '+32 470 22 33 44',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '1997-01-31',
    department: 'Operations',
    availability: 'Shift B',
    teamIds: [1],
    plantId: 1,
    address: 'Graslei 12, 9000 Gent'
  },
  {
    id: 114,
    firstName: 'Leon',
    lastName: 'Kennedy',
    birthDate: '1977-09-08',
    gender: 'Man',
    location: 'Antwerpen',
    role: 'Werknemer',
    email: 'leon.kennedy@company.com',
    phone: '+32 470 44 55 66',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '1998-09-29',
    department: 'Security',
    availability: 'Ma-Vr',
    teamIds: [2],
    plantId: 2,
    address: 'Nationalestraat 45, 2000 Antwerpen'
  },
  {
    id: 115,
    firstName: 'Jill',
    lastName: 'Valentine',
    birthDate: '1974-02-14',
    gender: 'Vrouw',
    location: 'Antwerpen',
    role: 'Werknemer',
    email: 'jill.valentine@company.com',
    phone: '+32 470 77 88 99',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '1996-07-24',
    department: 'Security',
    availability: 'Ma-Vr',
    teamIds: [2],
    plantId: 2,
    address: 'Kammenstraat 18, 2000 Antwerpen'
  },
  {
    id: 116,
    firstName: 'Jan',
    lastName: 'de Vakantieganger',
    birthDate: '1980-01-01',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'jan.vakantie@company.com',
    phone: '+32 470 00 00 02',
    contractType: 'Voltijds',
    status: 'Met Verlof',
    joinDate: '2020-01-01',
    department: 'Operations',
    availability: 'Ma-Vr',
    teamIds: [],
    plantId: 1,
    address: 'Vakantiestraat 1'
  },
  {
    id: 117,
    firstName: 'Piet',
    lastName: 'de Zieke',
    birthDate: '1982-02-02',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'piet.zieke@company.com',
    phone: '+32 470 00 00 03',
    contractType: 'Voltijds',
    status: 'Ziek',
    joinDate: '2020-01-01',
    department: 'Operations',
    availability: 'Ma-Vr',
    teamIds: [],
    plantId: 1,
    address: 'Ziekenhuisstraat 2'
  },
  {
    id: 998,
    firstName: 'Werknemer',
    lastName: '',
    birthDate: '1990-01-01',
    gender: 'Man',
    location: 'Gent',
    role: 'Werknemer',
    email: 'werknemer@company.com',
    phone: '+32 470 00 00 01',
    contractType: 'Voltijds',
    status: 'Beschikbaar',
    joinDate: '2020-01-01',
    department: 'Operations',
    availability: 'Ma-Vr',
    teamIds: [],
    plantId: 1,
    address: 'Kantoor'
  }
];

export const mockPlants: Plant[] = [
  { id: 1, name: 'Gent Hoofdvestiging', location: 'Gent', type: 'Productie', status: 'Operationeel', capacity: 100, managerId: 101 },
  { id: 2, name: 'Antwerpen Haven', location: 'Antwerpen', type: 'Distributie', status: 'Onderhoud', capacity: 80, managerId: 107 },
  { id: 3, name: 'Brussel R&D', location: 'Brussel', type: 'R&D', status: 'Operationeel', capacity: 50, managerId: 107 },
  { id: 4, name: 'Luik Assemblage', location: 'Luik', type: 'Assemblage', status: 'Offline', capacity: 120, managerId: 101 },
  { id: 5, name: 'Brugge Hub', location: 'Brugge', type: 'Distributie', status: 'Operationeel', capacity: 60, managerId: 102 }
];



export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Fireflies',
    plant: 'Gent Hoofdvestiging',
    status: 'Actief',
    color: '#ef4444', // red-500
    members: [
      { id: 101, role: 'Supervisor', name: 'Joel Miller' },
      { id: 102, role: 'Werknemer', name: 'Ellie Williams' },
    ]
  },
  {
    id: 2,
    name: 'WLF',
    plant: 'Gent Hoofdvestiging',
    status: 'Actief',
    color: '#3b82f6', // blue-500
    members: [
      { id: 105, role: 'Supervisor', name: 'Abby Anderson' },
      { id: 106, role: 'Werknemer', name: 'Jesse' },
      { id: 107, role: 'Werknemer', name: 'Lev' },
      { id: 108, role: 'Werknemer', name: 'Yara' }
    ]
  },
  {
    id: 3,
    name: 'Jackson Patrol',
    plant: 'Gent Hoofdvestiging',
    status: 'Actief',
    color: '#22c55e', // green-500
    members: [
      { id: 103, role: 'Supervisor', name: 'Tommy Miller' },
      { id: 104, role: 'Werknemer', name: 'Dina' },
      { id: 999, role: 'Manager', name: 'Almighty Manager' }
    ]
  }
];

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string; // New mandatory field
  assignedTo?: string; // Name of employee or team
  assignedToId?: number;
  assignedToType?: 'Employee' | 'Team';
  status: 'In Wacht' | 'Bezig' | 'Voltooid' | 'Geblokkeerd' | 'Onnodig' | 'Stopgezet';
  priority: 'Laag' | 'Gemiddeld' | 'Hoog';
  dueDate?: string;
  startDate?: string;
  startTime?: string; // New field for time grid
  endDate?: string;
  plant: string;
  timeAllocation: string;
  specifications: string; // Mandatory
}

// Helper to generate dates relative to today
const getRelativeDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const generateTasks = (): Task[] => {
  const tasks: Task[] = [];
  const priorities: ('Laag' | 'Gemiddeld' | 'Hoog')[] = ['Laag', 'Gemiddeld', 'Hoog'];
  const statuses: ('In Wacht' | 'Bezig' | 'Voltooid')[] = ['In Wacht', 'Bezig', 'Voltooid'];
  const categories = ['Onderhoud', 'Inspectie', 'Logistiek', 'Beveiliging', 'Administratie'];
  const taskTitles = [
    'Perimeter Check', 'Generator Maintenance', 'Supply Run', 'Wall Reinforcement', 'Medical Inventory',
    'Training Session', 'Water Purification', 'Guard Duty', 'Radio Tower Repair', 'Crop Harvesting',
    'Surveillance', 'Vehicle Repair', 'Fence Painting', 'Ammo Sorting', 'Library Organization',
    'Greenhouse Maintenance', 'Solar Panel Cleaning', 'CCTV Maintenance', 'Fire Extinguisher Check', 'First Aid Restock'
  ];

  // 1. Assigned Tasks (Past, Present, Future)
  // Distribute across employees and teams
  const assignees = [
    { id: 101, type: 'Employee', name: 'Joel Miller' },
    { id: 102, type: 'Employee', name: 'Ellie Williams' },
    { id: 103, type: 'Employee', name: 'Tommy Miller' },
    { id: 104, type: 'Employee', name: 'Dina' },
    { id: 105, type: 'Employee', name: 'Abby Anderson' },
    { id: 106, type: 'Employee', name: 'Jesse' },
    { id: 107, type: 'Employee', name: 'Lev' },
    { id: 108, type: 'Employee', name: 'Yara' },
    { id: 999, type: 'Employee', name: 'Almighty Manager' },
    { id: 1, type: 'Team', name: 'Fireflies' },
    { id: 2, type: 'Team', name: 'WLF' },
    { id: 3, type: 'Team', name: 'Jackson Patrol' }
  ];

  let idCounter = 1;

  // Generate ~60 assigned tasks spread over -7 to +14 days
  for (let i = 0; i < 60; i++) {
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];
    const daysOffset = Math.floor(Math.random() * 21) - 7; // -7 to +14
    const duration = Math.floor(Math.random() * 3) + 1; // 1-3 days
    const startDate = getRelativeDate(daysOffset);
    const endDate = getRelativeDate(daysOffset + duration - 1);
    
    const dueDate = getRelativeDate(daysOffset + duration + 2); // Due 2 days after end

    tasks.push({
      id: idCounter++,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: `Auto-generated task description for ${assignee.name}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      assignedTo: assignee.name,
      assignedToId: assignee.id,
      assignedToType: assignee.type as 'Employee' | 'Team',
      startDate: startDate,
      endDate: endDate,
      dueDate: dueDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      plant: 'Gent Hoofdvestiging',
      timeAllocation: `${Math.floor(Math.random() * 8) + 1}h`,
      specifications: 'Standaard procedure volgen.'
    });
  }

  // 1b. Specific tasks for "Werknemer" (ID 998) to populate their view
  const startTimes = ['08:00', '09:00', '10:30', '13:00', '14:30', '15:00'];
  
  for (let i = 0; i < 15; i++) {
    const daysOffset = Math.floor(Math.random() * 21) - 7; // -7 to +14
    const duration = 1; // Keep it simple for grid view, mostly 1 day tasks
    const startDate = getRelativeDate(daysOffset);
    const endDate = getRelativeDate(daysOffset); // Same day for grid simplicity
    const dueDate = getRelativeDate(daysOffset + 2);
    
    const randomStartTime = startTimes[Math.floor(Math.random() * startTimes.length)];

    tasks.push({
      id: idCounter++,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: `Task for Werknemer`,
      category: categories[Math.floor(Math.random() * categories.length)],
      assignedTo: 'Werknemer',
      assignedToId: 998,
      assignedToType: 'Employee',
      startDate: startDate,
      endDate: endDate,
      startTime: randomStartTime, // Add start time
      dueDate: dueDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      plant: 'Gent Hoofdvestiging',
      timeAllocation: `${Math.floor(Math.random() * 3) + 1}h`, // 1-3 hours
      specifications: 'Standaard procedure volgen.'
    });
  }

  // 2. Unassigned Tasks (Werkvoorraad)
  // Generate 60 unassigned tasks
  for (let i = 0; i < 60; i++) {
    const daysOffset = Math.floor(Math.random() * 30) + 1; // 1 to 30 days in future
    const duration = Math.floor(Math.random() * 5) + 1; // 1-5 days
    // const startDate = getRelativeDate(daysOffset); // Removed for backlog items
    // const endDate = getRelativeDate(daysOffset + duration - 1); // Removed for backlog items
    const dueDate = getRelativeDate(daysOffset + duration + 5); // Due 5 days after end

    tasks.push({
      id: idCounter++,
      title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
      description: 'Unassigned task waiting for allocation',
      category: categories[Math.floor(Math.random() * categories.length)],
      status: 'In Wacht',
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      plant: 'Gent Hoofdvestiging',
      timeAllocation: `${Math.floor(Math.random() * 8) + 1}h`,
      specifications: 'Nog toe te wijzen.',
      // startDate: startDate, // Removed
      // endDate: endDate, // Removed
      dueDate: dueDate
    });
  }

  return tasks;
};

export const mockTasks: Task[] = generateTasks();

export const mockAbsence: Absence[] = [
  { id: 1, employeeName: 'Joel Miller', type: 'Verlof', startDate: '2025-12-10', endDate: '2025-12-15', status: 'Goedgekeurd', reason: 'Personal time' },
  { id: 2, employeeName: 'Ellie Williams', type: 'Ziekte', startDate: '2025-12-04', endDate: '2025-12-05', status: 'Goedgekeurd', reason: 'Flu' },
  { id: 3, employeeName: 'Abby Anderson', type: 'Ziekte', startDate: '2025-12-08', endDate: '2025-12-09', status: 'In Behandeling', reason: 'Injury' },
  { id: 4, employeeName: 'Yara', type: 'Verlof', startDate: '2025-12-05', endDate: '2025-12-10', status: 'Goedgekeurd', reason: 'Family visit' },
  { id: 5, employeeName: 'Dina', type: 'Ouderschapsverlof', startDate: '2025-12-15', endDate: '2026-01-15', status: 'Goedgekeurd', reason: 'Maternity leave' },
  { id: 6, employeeName: 'Jan de Vakantieganger', type: 'Verlof', startDate: '2025-12-01', endDate: '2025-12-10', status: 'Goedgekeurd', reason: 'Holiday' },
  { id: 7, employeeName: 'Piet de Zieke', type: 'Ziekte', startDate: '2025-12-01', endDate: '2025-12-10', status: 'Goedgekeurd', reason: 'Sick' }
];
