// 4x4 Fitment Centre — work types (add-ons, no engine/gearbox/respray)

import { Category } from './types';

export const FITMENT_CATEGORIES: { id: string; name: string; taskName: string }[] = [
  { id: 'suspension', name: 'Suspension Upgrade', taskName: 'Suspension fitment / upgrade' },
  { id: 'bumpers', name: 'Bumpers', taskName: 'Front bumper fitment' },
  { id: 'towbars', name: 'Towbars', taskName: 'Towbar fitment' },
  { id: 'seat-covers', name: 'Seat Covers', taskName: 'Seat cover fitment' },
  { id: 'exhaust', name: 'Exhaust Systems', taskName: 'Exhaust system fitment' },
  { id: 'tyres-mags', name: 'Tyres & Mags', taskName: 'Tyres and mags' },
  { id: 'fridges', name: 'Fridges', taskName: 'Fridge / drawer fitment' },
  { id: 'lighting', name: 'Lighting', taskName: 'Spotlights / headlights / lighting' },
  { id: 'long-range-tanks', name: 'Long Range Tanks', taskName: 'Long range tank fitment' },
  { id: 'rock-sliders', name: 'Rock Sliders', taskName: 'Rock sliders fitment' },
  { id: 'rear-bumper', name: 'Rear Bumper', taskName: 'Rear bumper fitment' },
  { id: 'winches', name: 'Winches', taskName: 'Winch fitment' },
  { id: 'belly-plates', name: 'Belly Plates', taskName: 'Belly plate / underbody protection' },
  { id: 'roof-consoles', name: 'Roof Consoles', taskName: 'Roof console fitment' },
  { id: 'steering-wheels', name: 'Steering Wheels', taskName: 'Steering wheel fitment' },
];

export function buildCategoriesFromFitmentIds(selectedIds: string[]): Category[] {
  return selectedIds
    .filter(id => FITMENT_CATEGORIES.some(f => f.id === id))
    .map((id, index) => {
      const fit = FITMENT_CATEGORIES.find(f => f.id === id)!;
      const taskId = `${fit.id}-${Date.now()}-${index}`;
      return {
        id: fit.id,
        name: fit.name,
        weight: 100,
        requiresQa: true,
        subTasks: [
          {
            id: taskId,
            name: fit.taskName,
            status: 'Pending' as const,
            priority: 'Normal' as const,
            internalNotes: [],
          },
        ],
      };
    });
}
