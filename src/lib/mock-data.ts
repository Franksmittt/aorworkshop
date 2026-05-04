// [path]: lib/mock-data.ts

import { Project, Technician, User, Media } from './types';
import { addDays, parseISO } from 'date-fns';

/** 4 May 2026, 12:00 SAST (UTC+2) */
const BOOKED_IN = '2026-05-04T10:00:00.000Z';
const bookInDate = parseISO(BOOKED_IN);

const BOOK_IN_PHOTO_COUNT = 72;

const buildBookInMedia = (): Media[] =>
  Array.from({ length: BOOK_IN_PHOTO_COUNT }, (_, i) => {
    const n = i + 1;
    const pad = String(n).padStart(3, '0');
    return {
      id: `media-epr042gp-bi-${pad}`,
      url: `/projects/epr042gp/book-in/book-in-${pad}.jpeg`,
      caption: `Book-in — condition record (${n}/${BOOK_IN_PHOTO_COUNT})`,
      category: 'Check-in',
      isFeatured: n === 1,
    };
  });

const epr042gpBookInMedia = buildBookInMedia();
const epr042gpBookInPhotoUrls = epr042gpBookInMedia.map((m) => m.url);

export const mockUsers: User[] = [
  { id: 'user-boss', name: 'Jaco', role: 'Boss' },
  { id: 'user-staff-marius', name: 'Marius', role: 'Staff' },
  { id: 'user-staff-jovan', name: 'Jovan', role: 'Staff' },
];

export const mockTechnicians: Technician[] = [
  { id: 'tech-marius', name: 'Marius', userId: 'user-staff-marius', hourlyRate: 0 },
  { id: 'tech-jovan', name: 'Jovan', userId: 'user-staff-jovan', hourlyRate: 0 },
];

export const mockProjects: Project[] = [
  {
    id: 'lc79-epr042gp',
    customerName: 'Cobra Fire',
    car: {
      make: 'Toyota',
      model: 'Land Cruiser 79 Series (Pick-up)',
      year: 2024,
      numberPlate: 'EPR042GP',
      mileageIn: 110,
    },
    vehicleChecklist: {
      completedAt: BOOKED_IN,
      mileageIn: 110,
      keysReceived: true,
      damageNoted:
        'Full book-in photo set on file for condition baseline (workshop, client, and social). Note any pre-existing marks against this set.',
      customerRequests:
        'Fitment scope: leaf springs, shackles & bushes; EFS Elite shocks (front & rear); steering damper; front and rear replacement bumpers. OEM / old hardware must be stripped before new kit is fitted. Vehicle has no load bin (easier access). Brand new vehicle — install conditions favourable.',
      photosOnArrival: epr042gpBookInPhotoUrls,
    },
    status: 'Active',
    createdAt: BOOKED_IN,
    promisedDate: addDays(bookInDate, 28).toISOString(),
    provenance: [
      {
        id: 'prov-epr042gp-1',
        title: 'Vehicle book-in',
        date: BOOKED_IN,
        description:
          'Toyota Land Cruiser 79 Series pick-up (EPR042GP) for Cobra Fire — booked in 4 May 2026. Book-in photography complete; stripping and fitment tracked against weighted progress milestones.',
        imageUrl: epr042gpBookInMedia[0]?.url ?? '',
      },
    ],
    media: epr042gpBookInMedia,
    categories: [
      {
        id: 'lc79-stripping',
        name: 'Stripping — remove OEM / old hardware',
        weight: 20,
        requiresQa: false,
        subTasks: [
          {
            id: 'lc79-s-1',
            name: 'Strip rear suspension (leaf springs, shackles, bushes, old shocks)',
            status: 'Pending',
            priority: 'High',
            progressWeight: 10,
            assignedTo: 'tech-marius',
            estimateHours: 6,
          },
          {
            id: 'lc79-s-2',
            name: 'Strip front suspension (incl. old front shocks / mounts)',
            status: 'Pending',
            priority: 'High',
            progressWeight: 5,
            assignedTo: 'tech-jovan',
            estimateHours: 4,
          },
          {
            id: 'lc79-s-3',
            name: 'Strip front bumper',
            status: 'Pending',
            priority: 'Normal',
            progressWeight: 3,
            assignedTo: 'tech-marius',
            estimateHours: 2,
          },
          {
            id: 'lc79-s-4',
            name: 'Strip rear bumper',
            status: 'Pending',
            priority: 'Normal',
            progressWeight: 2,
            assignedTo: 'tech-jovan',
            estimateHours: 2,
          },
        ],
      },
      {
        id: 'lc79-fitment',
        name: 'Fitment — new kit & bumpers',
        weight: 80,
        requiresQa: true,
        subTasks: [
          {
            id: 'lc79-f-1',
            name: 'Fit rear leaf springs, shackles & bushes',
            status: 'Pending',
            priority: 'High',
            progressWeight: 22,
            assignedTo: 'tech-marius',
            estimateHours: 10,
          },
          {
            id: 'lc79-f-2',
            name: 'Fit rear EFS Elite shocks',
            status: 'Pending',
            priority: 'High',
            progressWeight: 10,
            assignedTo: 'tech-jovan',
            estimateHours: 4,
          },
          {
            id: 'lc79-f-3',
            name: 'Fit front suspension & front EFS Elite shocks',
            status: 'Pending',
            priority: 'High',
            progressWeight: 24,
            assignedTo: 'tech-marius',
            estimateHours: 12,
          },
          {
            id: 'lc79-f-4',
            name: 'Fit steering damper',
            status: 'Pending',
            priority: 'Normal',
            progressWeight: 8,
            assignedTo: 'tech-jovan',
            estimateHours: 3,
          },
          {
            id: 'lc79-f-5',
            name: 'Fit front bumper',
            status: 'Pending',
            priority: 'Normal',
            progressWeight: 8,
            assignedTo: 'tech-marius',
            estimateHours: 5,
          },
          {
            id: 'lc79-f-6',
            name: 'Fit rear bumper',
            status: 'Pending',
            priority: 'Normal',
            progressWeight: 8,
            assignedTo: 'tech-jovan',
            estimateHours: 5,
          },
        ],
      },
    ],
    timeline: [
      {
        id: 'tl-epr042gp-1',
        date: BOOKED_IN,
        update:
          'Booked in 4 May 2026 @ 12:00 — Cobra Fire / LC79 EPR042GP @ 110 km. Scope: suspension (leafs, shackles, bushes), EFS Elite shocks, steering damper, front & rear bumpers. No load bin; brand new vehicle. Team: Marius, Jovan.',
        category: 'Check-in',
      },
    ],
    messages: [],
    financials: { totalQuoted: 0, totalPaid: 0, invoices: [] },
  },
];
