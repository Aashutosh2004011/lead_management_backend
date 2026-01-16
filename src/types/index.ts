export enum LeadStage {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

export enum LeadStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CONVERTED = 'CONVERTED',
  REJECTED = 'REJECTED',
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  stage: LeadStage;
  status: LeadStatus;
  source: string;
  value: number;
  notes?: string;
  assignedTo?: string;
  country: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeadFilters {
  search?: string;
  stage?: LeadStage;
  status?: LeadStatus;
  source?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AnalyticsData {
  totalLeads: number;
  convertedLeads: number;
  activeLeads: number;
  totalValue: number;
  averageValue: number;
  leadsByStage: Record<LeadStage, number>;
  leadsByStatus: Record<LeadStatus, number>;
  leadsBySource: { source: string; count: number }[];
}
