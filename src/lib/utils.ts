// [path]: lib/utils.ts

import { Project } from './types';

// This is the main workshop labor rate in ZAR per hour.
const WORKSHOP_HOURLY_RATE = 450;

export const calculateOverallProgress = (project: Project | null): number => {
  if (!project || !project.categories || project.categories.length === 0) return 0;

  const totalProgress = project.categories.reduce((acc, category) => {
    const completedTasks = category.subTasks.filter(t => t.status === 'Completed').length;
    const categoryProgress = category.subTasks.length > 0 ? (completedTasks / category.subTasks.length) : 0;
    return acc + (categoryProgress * category.weight);
  }, 0);

  const totalWeight = project.categories.reduce((acc, category) => acc + category.weight, 0);

  if (totalWeight === 0) return 0;
  
  return (totalProgress / totalWeight) * 100;
};

// --- NEW: Financial Calculation Functions ---

export const calculateProjectCosts = (project: Project) => {
    // 1. Calculate total labor cost
    const totalHours = project.categories.reduce((acc, category) => 
        acc + category.subTasks.reduce((taskAcc, task) => taskAcc + (task.actualHours || 0), 0)
    , 0);
    const laborCost = totalHours * WORKSHOP_HOURLY_RATE;

    // 2. Calculate total parts cost
    const partsCost = project.categories.reduce((acc, category) =>
        acc + category.subTasks.reduce((taskAcc, task) =>
            taskAcc + (task.parts?.reduce((partAcc, part) => partAcc + ((part.unitCost || 0) * part.qty), 0) || 0)
        , 0)
    , 0);
    
    const totalCost = laborCost + partsCost;

    return { laborCost, partsCost, totalCost };
};

export const calculateProjectProfitability = (project: Project) => {
    const { totalCost } = calculateProjectCosts(project);
    const totalQuoted = project.financials.totalQuoted;
    
    const netProfit = totalQuoted - totalCost;
    const margin = totalQuoted > 0 ? (netProfit / totalQuoted) * 100 : 0;

    return { netProfit, margin };
};