// [path]: lib/mock-data.ts

import { Project, Technician, User } from './types';
import { subDays, addDays } from 'date-fns';

const today = new Date();
export const mockUsers: User[] = [
  { id: 'user-boss', name: 'Jaco', role: 'Boss' },
  { id: 'user-staff-marius', name: 'Marius', role: 'Staff' },
  { id: 'user-staff-roelof', name: 'Roelof', role: 'Staff' },
];

export const mockTechnicians: Technician[] = [
  { id: 'tech-marius', name: 'Marius', userId: 'user-staff-marius', hourlyRate: 0 },
  { id: 'tech-roelof', name: 'Roelof', userId: 'user-staff-roelof', hourlyRate: 0 },
];

export const mockProjects: Project[] = [
  {
    id: 'hilux-2020-fitment',
    customerName: 'John Smith',
    car: { make: 'Toyota', model: 'Hilux', year: 2020, vin: 'ABC123', mileageIn: 45000 },
    status: 'Active',
    createdAt: subDays(today, 10).toISOString(),
    promisedDate: addDays(today, 14).toISOString(),
    provenance: [
      { id: 'prov-1', title: 'Vehicle check-in', date: subDays(today, 10).toISOString(), description: 'Hilux arrived for suspension and bumper fitment.', imageUrl: '' },
    ],
    media: [
      { id: 'media-1', url: '/images/placeholder-vehicle.jpg', caption: 'Vehicle on arrival.', category: 'Check-in', isFeatured: true },
    ],
    categories: [
      {
        id: 'fit', name: 'Fitment', weight: 100,
        subTasks: [
          { id: 'fit1', name: 'Suspension lift kit', status: 'In Progress', priority: 'High', assignedTo: 'tech-marius', estimateHours: 8, actualHours: 4, startDate: subDays(today, 2).toISOString(), dueDate: addDays(today, 5).toISOString() },
          { id: 'fit2', name: 'Front bumper fitment', status: 'Pending', priority: 'Normal', assignedTo: 'tech-roelof', estimateHours: 6 },
        ]
      }
    ],
    timeline: [{ id: 't1', date: subDays(today, 10).toISOString(), update: 'Vehicle checked in. Fitment job started.', category: 'Check-in' }],
    messages: [],
    financials: { totalQuoted: 25000, totalPaid: 12500, invoices: [{ id: 'inv-1', description: 'Deposit', amount: 12500, status: 'Paid', dueDate: subDays(today, 10).toISOString() }] }
  },
  {
    id: 'ranger-2022-canopy',
    customerName: 'Robert Davis',
    car: { make: 'Ford', model: 'Ranger', year: 2022, mileageIn: 12000 },
    status: 'Active',
    createdAt: subDays(today, 3).toISOString(),
    promisedDate: addDays(today, 7).toISOString(),
    media: [],
    categories: [
      {
        id: 'can', name: 'Canopy & Rack', weight: 100,
        subTasks: [
          { id: 'can1', name: 'Fit canopy and roof rack', status: 'Pending', priority: 'Normal', assignedTo: 'tech-roelof', estimateHours: 4 },
        ]
      }
    ],
    timeline: [{ id: 't2', date: subDays(today, 3).toISOString(), update: 'Ranger booked for canopy and rack.', category: 'Check-in' }],
    messages: [],
    financials: { totalQuoted: 18000, totalPaid: 0, invoices: [] }
  },
  {
    id: 'jeep-2019-complete',
    customerName: 'David Chen',
    car: { make: 'Jeep', model: 'Wrangler', year: 2019 },
    status: 'Completed',
    createdAt: subDays(today, 30).toISOString(),
    promisedDate: subDays(today, 5).toISOString(),
    media: [],
    categories: [
      { id: 'done', name: 'Completed', weight: 100, subTasks: [
        { id: 'd1', name: 'Full fitment and accessories', status: 'Completed', priority: 'Normal', assignedTo: 'tech-marius', actualHours: 24, completedAt: subDays(today, 5).toISOString() },
      ] }
    ],
    timeline: [{ id: 't3', date: subDays(today, 5).toISOString(), update: 'Job complete. Vehicle collected.', category: 'Complete' }],
    messages: [],
    financials: { totalQuoted: 45000, totalPaid: 45000, invoices: [{ id: 'inv-3', description: 'Full payment', amount: 45000, status: 'Paid', dueDate: subDays(today, 30).toISOString() }] }
  },
];