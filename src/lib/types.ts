// [path]: lib/types.ts

// =======================================================================
// NEW ENTITIES - These are the new data models for our advanced features
// =======================================================================

export type QAStatus = 'Pending' | 'Passed' | 'Failed';
export type HoldReason = 'Awaiting Parts' | 'Awaiting Payment' | 'Awaiting Client Decision' | 'Internal QA' | '';

export type BreakType = 'Lunch' | 'Tea';

export interface Break {
  startTime: string;
  endTime?: string;
  type: BreakType;
}

export interface Shift {
  id: string;
  userId: string;
  clockInTime: string;
  clockOutTime?: string;
  breaks: Break[];
}

export interface Approval {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  priceImpact?: number;
  etaImpactDays?: number;
  status: 'Pending'|'Approved'|'Rejected';
  decidedAt?: string;
  decidedBy?: string; // userId
}

export interface Part {
  id: string;
  taskId: string;
  name: string;
  partNumber?: string;
  supplier?: string;
  qty: number;
  unitCost?: number;
  status: 'Needed'|'Ordered'|'Received'|'Cancelled';
  eta?: string;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  items: { partId: string; qty: number; unitCost: number }[];
  status: 'Open'|'Received'|'Cancelled';
  eta?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  stockQty: number;
  reorderPoint?: number;
  supplier?: string;
  unitCost?: number;
}


// =======================================================================
// EXISTING ENTITIES - These are being extended with new fields
// =======================================================================

export interface Technician {
  id: string;
  name: string;
  userId: string;
  hourlyRate?: number;
}

export type UserRole = 'Boss' | 'Staff';
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Message {
  id: string;
  author: string;
  authorRole: UserRole;
  text: string;
  visibleTo: 'BossOnly' | 'StaffOnly';
  createdAt: string;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  dueDate: string;
  description: string;
}

export interface InternalTaskNote {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
  type: 'Instruction' | 'Feedback' | 'Log';
}

export interface DecisionOption {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface SubTask {
  id: string;
  name:string;
  status: 'Pending' | 'In Progress' | 'Awaiting Approval' | 'Completed';
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  /** Whole-job share (all tasks should sum to 100). Used for overall progress bar. */
  progressWeight?: number;
  assignedTo?: Technician['id'];
  requiresClientApproval?: boolean;
  internalNotes?: InternalTaskNote[];
  estimateHours?: number;
  actualHours?: number;
  priceImpact?: number;
  etaImpactDays?: number;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
  qaStatus?: QAStatus;
  blockedBy?: string[];
  checklist?: {label:string; value?:string|number|boolean; checked: boolean}[];
  attachments?: {mediaId:string}[];
  parts?: Part[];
  approvals?: Approval[];
  // --- NEW FIELDS FOR CLIENT VIEW ---
  beforeImageUrl?: string;
  afterImageUrl?: string;
  technicianNotes?: string;
  decisionPrompt?: string;
  decisionOptions?: DecisionOption[];
}

export interface Category {
  id: string;
  name: string;
  weight: number;
  subTasks: SubTask[];
  requiresQa?: boolean;
  owner?: string; // Technician id for category lead
}

export interface TimelineUpdate {
  id: string;
  date: string;
  update: string;
  category: string;
}

export interface Media {
  id: string;
  url: string;
  caption: string;
  category: string;
  isFeatured?: boolean; // <-- NEW FIELD
}

export interface ProvenanceItem {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

/** Checklist when vehicle arrives at the 4x4 fitment centre */
export interface VehicleChecklist {
  completedAt?: string;
  mileageIn?: number;
  fuelLevel?: string;
  keysReceived?: boolean;
  damageNoted?: string;
  customerRequests?: string;
  photosOnArrival?: string[]; // URLs or base64
}

export interface Project {
  id:string;
  customerName: string;
  vehicleChecklist?: VehicleChecklist;
  car: {
    make: string;
    model: string;
    year: number;
    numberPlate?: string;
    vin?: string;
    color?: string;
    mileageIn?: number;
    mileageOut?: number;
  };
  status: 'Active' | 'Completed' | 'On Hold' | 'Awaiting QC';
  qcApprovedAt?: string;
  qcApprovedBy?: string;
  holdReason?: HoldReason;
  createdAt: string;
  promisedDate?: string;
  categories: Category[];
  timeline: TimelineUpdate[];
  media: Media[];
  messages: Message[];
  financials: {
    invoices: Invoice[];
    totalQuoted: number;
    totalPaid: number;
    partsCost?: number;
    laborCost?: number;
    totalCost?: number; // parts + labor
  };
  purchaseOrders?: PurchaseOrder[];
  branchId?: string;
  provenance?: ProvenanceItem[]; // <-- NEW FIELD
}

export interface AssignedTask extends SubTask {
  projectId: string;
  projectName: string;
  categoryName: string;
}

export interface UnscheduledTask extends SubTask {
  projectId: string;
  projectName: string;
  categoryId: string;
}