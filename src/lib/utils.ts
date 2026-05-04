// [path]: lib/utils.ts

import { Project, SubTask } from './types';

/** Earned share of the job (0 … task.progressWeight) for one subtask. */
export function taskProgressEarned(task: SubTask): number {
  const w = task.progressWeight;
  if (w == null || w <= 0) return 0;
  if (task.status === 'Completed') return w;
  if (task.status === 'In Progress') {
    const f = task.progressFraction;
    if (f == null || f <= 0) return 0;
    return w * Math.min(1, Math.max(0, f));
  }
  return 0;
}

export const calculateOverallProgress = (project: Project | null): number => {
  if (!project?.categories?.length) return 0;

  let weightedDone = 0;
  let weightedTotal = 0;

  for (const category of project.categories) {
    for (const task of category.subTasks) {
      const w = task.progressWeight;
      if (w != null && w > 0) {
        weightedTotal += w;
        weightedDone += taskProgressEarned(task);
      }
    }
  }

  if (weightedTotal > 0) {
    return (weightedDone / weightedTotal) * 100;
  }

  const totalProgress = project.categories.reduce((acc, category) => {
    const completedTasks = category.subTasks.filter((t) => t.status === 'Completed').length;
    const categoryProgress = category.subTasks.length > 0 ? completedTasks / category.subTasks.length : 0;
    return acc + categoryProgress * category.weight;
  }, 0);

  const totalWeight = project.categories.reduce((acc, category) => acc + category.weight, 0);

  if (totalWeight === 0) return 0;

  return (totalProgress / totalWeight) * 100;
};
