// [path]: lib/data-service.ts

import { mockProjects, mockUsers, mockTechnicians } from './mock-data';
import { mockShifts } from './mock-shifts';
import { mockInventory } from './mock-inventory';
import { Project, SubTask, Category, InternalTaskNote, Shift, BreakType, InventoryItem, Part, User, Technician, Media } from './types';
import { fullRestorationTemplate, majorServiceTemplate } from './project-templates';

// --- STORAGE KEYS ---
const PROJECTS_STORAGE_KEY = 'ABSOLUTE_OFFROAD_PROJECTS_V3';
const SHIFTS_STORAGE_KEY = 'ABSOLUTE_OFFROAD_TIMESHEETS';
const INVENTORY_STORAGE_KEY = 'ABSOLUTE_OFFROAD_INVENTORY';
const TEMPLATES_STORAGE_KEY = 'ABSOLUTE_OFFROAD_TEMPLATES';
const USERS_STORAGE_KEY = 'ABSOLUTE_OFFROAD_USERS_V3';
const TECHNICIANS_STORAGE_KEY = 'ABSOLUTE_OFFROAD_TECHNICIANS_V3';

/** Clears persisted workshop data (all versions) and auth cookie keys used in dev. */
export function clearWorkshopLocalStorage(): void {
  if (typeof window === 'undefined') return;
  [
    PROJECTS_STORAGE_KEY,
    USERS_STORAGE_KEY,
    TECHNICIANS_STORAGE_KEY,
    SHIFTS_STORAGE_KEY,
    INVENTORY_STORAGE_KEY,
    TEMPLATES_STORAGE_KEY,
    'ABSOLUTE_OFFROAD_PROJECTS_V2',
    'ABSOLUTE_OFFROAD_USERS_V2',
    'ABSOLUTE_OFFROAD_TECHNICIANS_V2',
    'ABSOLUTE_OFFROAD_PROJECTS',
    'ABSOLUTE_OFFROAD_USERS',
    'ABSOLUTE_OFFROAD_TECHNICIANS',
    'ABSOLUTE_OFFROAD_USER',
    'ABSOLUTE_OFFROAD_USER_V2',
  ].forEach((k) => localStorage.removeItem(k));
}

// =======================================================================
// HELPER FUNCTIONS FOR LOCAL STORAGE
// =======================================================================

// Generic function to get items from storage or return mock data
const getFromStorage = <T>(key: string, mockData: T[]): T[] => {
  if (typeof window === 'undefined') return mockData;
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) {
      localStorage.setItem(key, JSON.stringify(mockData));
      return mockData;
    }
    return JSON.parse(storedData);
  } catch (error) {
    console.error(`Could not access localStorage for key "${key}".`, error);
    return mockData;
  }
};

// Generic function to save items to storage
const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Could not save to localStorage for key "${key}".`, error);
    }
  }
};

// =======================================================================
// USER & TECHNICIAN DATA SERVICE
// =======================================================================

export const getUsers = (): User[] => getFromStorage(USERS_STORAGE_KEY, mockUsers);
export const getTechnicians = (): Technician[] => getFromStorage(TECHNICIANS_STORAGE_KEY, mockTechnicians);

export const getTechnicianById = (id: string): Technician | undefined => {
  return getTechnicians().find(tech => tech.id === id);
};

export const addTechnician = (techData: Omit<Technician, 'id' | 'userId'>): Technician => {
  const users = getUsers();
  const technicians = getTechnicians();

  // 1. Create a corresponding User record
  const newUserId = `user-${Date.now()}`;
  const newUser: User = {
    id: newUserId,
    name: techData.name,
    role: 'Staff',
  };
  const updatedUsers = [...users, newUser];
  saveToStorage(USERS_STORAGE_KEY, updatedUsers);

  // 2. Create the new Technician record
  const newTechnician: Technician = {
    ...techData,
    id: `tech-${Date.now()}`,
    userId: newUserId,
  };
  const updatedTechnicians = [...technicians, newTechnician];
  saveToStorage(TECHNICIANS_STORAGE_KEY, updatedTechnicians);

  return newTechnician;
};

export const updateTechnician = (id: string, updatedData: Partial<Technician>): Technician | undefined => {
  const users = getUsers();
  const technicians = getTechnicians();
  let updatedTechnician: Technician | undefined;

  // 1. Update the technician record
  const updatedTechnicians = technicians.map(tech => {
    if (tech.id === id) {
      updatedTechnician = { ...tech, ...updatedData };
      return updatedTechnician;
    }
    return tech;
  });

  if (updatedTechnician) {
    // 2. If the name was changed, update the corresponding user record
    const updatedUsers = users.map(user => {
      if (user.id === updatedTechnician!.userId) {
        return { ...user, name: updatedTechnician!.name };
      }
      return user;
    });
    saveToStorage(USERS_STORAGE_KEY, updatedUsers);
    saveToStorage(TECHNICIANS_STORAGE_KEY, updatedTechnicians);
  }

  return updatedTechnician;
};

export const deleteTechnician = (id: string): void => {
  const users = getUsers();
  const technicians = getTechnicians();

  const techToDelete = technicians.find(tech => tech.id === id);
  if (!techToDelete) return;

  // 1. Remove the technician
  const updatedTechnicians = technicians.filter(tech => tech.id !== id);
  
  // 2. Remove the associated user
  const updatedUsers = users.filter(user => user.id !== techToDelete.userId);

  saveToStorage(TECHNICIANS_STORAGE_KEY, updatedTechnicians);
  saveToStorage(USERS_STORAGE_KEY, updatedUsers);
};


// =======================================================================
// PROJECT DATA SERVICES
// =======================================================================

export const getProjects = (): Project[] => getFromStorage(PROJECTS_STORAGE_KEY, mockProjects);
export const saveProjects = (projects: Project[]) => saveToStorage(PROJECTS_STORAGE_KEY, projects);

export const getProjectById = (id: string): Project | undefined => {
  return getProjects().find(p => p.id === id);
};

export const addMediaToProject = (projectId: string, mediaData: Omit<Media, 'id'>): Project | undefined => {
  const projects = getProjects();
  let updatedProject: Project | undefined;

  const newProjects = projects.map(p => {
    if (p.id === projectId) {
      const newMediaItem: Media = {
        ...mediaData,
        id: `media-${Date.now()}`,
      };
      updatedProject = { ...p, media: [...p.media, newMediaItem] };
      return updatedProject;
    }
    return p;
  });

  saveProjects(newProjects);
  return updatedProject;
}

export const updateProject = (projectId: string, updatedData: Partial<Project>): Project | undefined => {
  const projects = getProjects();
  let updatedProject: Project | undefined;
  const newProjects = projects.map(p => {
    if (p.id === projectId) {
      updatedProject = { ...p, ...updatedData };
      return updatedProject;
    }
    return p;
  });
  saveProjects(newProjects);
  return updatedProject;
};

export const addProject = (newProjectData: Omit<Project, 'id'>): Project => {
  const projects = getProjects();
  const newProject: Project = {
    ...newProjectData,
    id: `${newProjectData.car.make.toLowerCase().replace(/\s/g, '-')}-${newProjectData.car.year}-${Date.now()}`
  };
  const updatedProjects = [...projects, newProject];
  saveProjects(updatedProjects);
  return newProject;
};

export const deleteProject = (projectId: string): void => {
  const projects = getProjects();
  const updatedProjects = projects.filter(p => p.id !== projectId);
  saveProjects(updatedProjects);
};

// =======================================================================
// OTHER DATA SERVICES
// =======================================================================

export const getShifts = (): Shift[] => getFromStorage(SHIFTS_STORAGE_KEY, mockShifts);
const saveShifts = (shifts: Shift[]) => saveToStorage(SHIFTS_STORAGE_KEY, shifts);

export const getInventoryItems = (): InventoryItem[] => getFromStorage(INVENTORY_STORAGE_KEY, mockInventory);

export const getTemplates = (): Category[][] => {
  if (typeof window === 'undefined') return [fullRestorationTemplate, majorServiceTemplate];
  try {
    const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!storedTemplates) {
      const defaultTemplates = [fullRestorationTemplate, majorServiceTemplate];
      defaultTemplates[0][0].name = "Full Restoration - Body & Paint";
      defaultTemplates[1][0].name = "Major Service - Engine Service";
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(defaultTemplates));
      return defaultTemplates;
    }
    return JSON.parse(storedTemplates);
  } catch (error) {
    console.error("Could not access localStorage for templates.", error);
    return [fullRestorationTemplate, majorServiceTemplate];
  }
};

export const saveTemplates = (templates: Category[][]) => saveToStorage(TEMPLATES_STORAGE_KEY, templates);

export const getUserTimeTrackingStatus = (userId: string) => {
    const shifts = getShifts();
    const lastShift = shifts
        .filter(s => s.userId === userId)
        .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime())[0];
    if (!lastShift || lastShift.clockOutTime) {
        return { status: 'ClockedOut' as const, shiftId: null, breakType: null };
    }

    const lastBreak = lastShift.breaks[lastShift.breaks.length - 1];
    if (lastBreak && !lastBreak.endTime) {
        return { status: 'OnBreak' as const, shiftId: lastShift.id, breakType: lastBreak.type };
    }
    
    return { status: 'ClockedIn' as const, shiftId: lastShift.id, breakType: null };
};

export const clockIn = (userId: string): Shift => {
    const shifts = getShifts();
    const newShift: Shift = {
        id: `shift-${Date.now()}`,
        userId,
        clockInTime: new Date().toISOString(),
        breaks: [],
    };
    const newShifts = [...shifts, newShift];
    saveShifts(newShifts);
    return newShift;
};

export const clockOut = (shiftId: string): Shift | undefined => {
    const shifts = getShifts();
    let updatedShift: Shift | undefined;
    const newShifts = shifts.map(s => {
        if (s.id === shiftId) {
            updatedShift = { ...s, clockOutTime: new Date().toISOString() };
            return updatedShift;
        }
        return s;
    });
    saveShifts(newShifts);
    return updatedShift;
};

export const startBreak = (shiftId: string, type: BreakType): Shift | undefined => {
    const shifts = getShifts();
    let updatedShift: Shift | undefined;
    const newShifts = shifts.map(s => {
        if (s.id === shiftId) {
            updatedShift = { ...s, breaks: [...s.breaks, { type, startTime: new Date().toISOString() }] };
            return updatedShift;
        }
        return s;
    });
    saveShifts(newShifts);
    return updatedShift;
};

export const endBreak = (shiftId: string): Shift | undefined => {
    const shifts = getShifts();
    let updatedShift: Shift | undefined;
    const newShifts = shifts.map(s => {
        if (s.id === shiftId) {
            const lastBreakIndex = s.breaks.length - 1;
            if (lastBreakIndex >= 0 && !s.breaks[lastBreakIndex].endTime) {
                const newBreaks = [...s.breaks];
                newBreaks[lastBreakIndex] = { ...newBreaks[lastBreakIndex], endTime: new Date().toISOString() };
                updatedShift = { ...s, breaks: newBreaks };
                return updatedShift;
            }
        }
        return s;
    });
    saveShifts(newShifts);
    return updatedShift;
};

export const logTaskTime = (projectId: string, categoryId: string, taskId: string, hoursToAdd: number): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => cat.id === categoryId ? { ...cat, subTasks: cat.subTasks.map(task => task.id === taskId ? { ...task, actualHours: (task.actualHours || 0) + hoursToAdd } : task) } : cat) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const updateTaskStatus = (projectId: string, categoryId: string, taskId: string, newStatus: SubTask['status']): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => cat.id === categoryId ? { ...cat, subTasks: cat.subTasks.map(task => {
                        if (task.id === taskId) {
                            const updatedTask = { ...task, status: newStatus };
                            if (newStatus === 'Completed') {
                                updatedTask.completedAt = new Date().toISOString();
                            } else {
                                delete updatedTask.completedAt;
                            }
                            return updatedTask;
                        }
                        return task;
                    }) } : cat) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const addPartToTask = (projectId: string, categoryId: string, taskId: string, partData: Omit<Part, 'id' | 'taskId' | 'status'>): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => cat.id === categoryId ? { ...cat, subTasks: cat.subTasks.map(task => {
                if (task.id === taskId) {
                    const newPart: Part = {
                        ...partData,
                        id: `part-${Date.now()}`,
                        taskId: taskId,
                        status: 'Needed',
                    };
                    const existingParts = task.parts || [];
                    return { ...task, parts: [...existingParts, newPart] };
                }
                return task;
            }) } : cat) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const declineTaskApproval = (projectId: string, categoryId: string, taskId: string): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => cat.id === categoryId ? { ...cat, subTasks: cat.subTasks.map(task => task.id === taskId ? { ...task, status: 'Pending', requiresClientApproval: false } : task) } : cat) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const updateCategoryQaStatus = (projectId: string, categoryId: string, qaPassed: boolean): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => {
                    if (cat.id === categoryId && !qaPassed) {
                        return { ...cat, subTasks: cat.subTasks.map(task => ({ ...task, status: 'Pending' as const })) };
                    }
                    return cat;
                }) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const addNoteToTask = (projectId: string, categoryId: string, taskId: string, note: Omit<InternalTaskNote, 'id'>): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = { ...p, categories: p.categories.map(cat => cat.id === categoryId ? { ...cat, subTasks: cat.subTasks.map(task => {
                        if (task.id === taskId) {
                            const newNote: InternalTaskNote = { ...note, id: `note-${Date.now()}` };
                            return { ...task, internalNotes: [...(task.internalNotes || []), newNote] };
                        }
                        return task;
                    }) } : cat) };
            return updatedProject;
        }
        return p;
    });
    saveProjects(newProjects);
    return updatedProject;
};

export const scheduleTask = (
    projectId: string, 
    categoryId: string, 
    taskId: string, 
    details: { startDate: string; dueDate: string; assignedTo: string }
): Project | undefined => {
    const projects = getProjects();
    let updatedProject: Project | undefined;
    const newProjects = projects.map(p => {
        if (p.id === projectId) {
            updatedProject = {
                ...p,
                categories: p.categories.map(cat => cat.id === categoryId ? {
                    ...cat,
                    subTasks: cat.subTasks.map(task => task.id === taskId ? {
                        ...task,
                        startDate: details.startDate,
                        dueDate: details.dueDate,
                        assignedTo: details.assignedTo,
                    } : task)
                } : cat)
            };
            return updatedProject;
        }
        return p;
    });

    saveProjects(newProjects);
    return updatedProject;
};