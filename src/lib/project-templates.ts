// [path]: lib/project-templates.ts

import { Category } from './types';

export const fullRestorationTemplate: Category[] = [
  {
    id: 'body-paint', name: 'Body & Paint', weight: 25, subTasks: [
      { id: 'bp1', name: 'Media Blasting', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'bp2', name: 'Rust Repair & Panel Replacement', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'bp3', name: 'Body Filler & Sanding', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'bp4', name: 'Primer Application', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'bp5', name: 'Final Paint', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'bp6', name: 'Clear Coat & Polishing', status: 'Pending', priority: 'Low', internalNotes: [] },
    ]
  },
  {
    id: 'chassis-suspension', name: 'Chassis & Suspension', weight: 20, subTasks: [
      { id: 'cs1', name: 'Frame Inspection & Repair', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'cs2', name: 'Front Suspension Rebuild', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'cs3', name: 'Rear Suspension Rebuild', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'cs4', name: 'Brake System Installation', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'cs5', name: 'Steering Box & Linkage', status: 'Pending', priority: 'Normal', internalNotes: [] },
    ]
  },
  {
    id: 'engine', name: 'Engine & Drivetrain', weight: 25, subTasks: [
      { id: 'en1', name: 'Engine Disassembly & Inspection', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'en2', name: 'Block Machining', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'en3', name: 'Engine Assembly', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'en4', name: 'Transmission Rebuild', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'en5', name: 'Driveshaft Balancing & Installation', status: 'Pending', priority: 'Low', internalNotes: [] },
      { id: 'en6', name: 'Engine & Transmission Installation', status: 'Pending', priority: 'Normal', internalNotes: [] },
    ]
  },
  {
    id: 'interior', name: 'Interior', weight: 15, subTasks: [
      { id: 'in1', name: 'Floor Pan Sound Deadening', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'in2', name: 'Carpet Installation', status: 'Pending', priority: 'Low', internalNotes: [] },
      { id: 'in3', name: 'Dashboard & Gauge Restoration', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'in4', name: 'Seat Upholstery', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'in5', name: 'Headliner Installation', status: 'Pending', priority: 'Normal', internalNotes: [] },
    ]
  },
  {
    id: 'electrical', name: 'Electrical & Wiring', weight: 15, subTasks: [
      { id: 'el1', name: 'Design & Layout New Wiring Harness', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'el2', name: 'Main Harness Installation', status: 'Pending', priority: 'High', internalNotes: [] },
      { id: 'el3', name: 'Lighting & Signals', status: 'Pending', priority: 'Normal', internalNotes: [] },
      { id: 'el4', name: 'Ignition System', status: 'Pending', priority: 'Normal', internalNotes: [] },
    ]
  },
];

export const majorServiceTemplate: Category[] = [
    {
        id: 'engine', name: 'Engine Service', weight: 60, subTasks: [
            { id: 'ms1', name: 'Oil & Filter Change', status: 'Pending', priority: 'Normal', internalNotes: [] },
            { id: 'ms2', name: 'Spark Plug Replacement', status: 'Pending', priority: 'Normal', internalNotes: [] },
            { id: 'ms3', name: 'Air Filter Replacement', status: 'Pending', priority: 'Normal', internalNotes: [] },
            { id: 'ms4', name: 'Coolant Flush', status: 'Pending', priority: 'Low', internalNotes: [] },
            { id: 'ms5', name: 'Carburetor Tune-up', status: 'Pending', priority: 'Normal', internalNotes: [] },
        ]
    },
    {
        id: 'chassis', name: 'Chassis Check', weight: 40, subTasks: [
            { id: 'ms6', name: 'Brake Inspection', status: 'Pending', priority: 'High', internalNotes: [] },
            { id: 'ms7', name: 'Tire Rotation & Pressure Check', status: 'Pending', priority: 'Low', internalNotes: [] },
            { id: 'ms8', name: 'Suspension Check', status: 'Pending', priority: 'Normal', internalNotes: [] },
        ]
    }
];