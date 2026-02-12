
export enum UserRole {
  ADMIN = 'Admin',
  ANALYST = 'Analyst',
  VIEWER = 'Viewer'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export enum MatchStatus {
  MATCHED = 'Matched',
  PARTIAL = 'Partially Matched',
  UNMATCHED = 'Not Matched',
  DUPLICATE = 'Duplicate'
}

export interface TransactionRecord {
  id: string;
  transactionId: string;
  amount: number;
  referenceNumber: string;
  date: string;
  source: 'SYSTEM' | 'UPLOADED';
  status?: MatchStatus;
  matchedId?: string;
  mismatchedFields?: string[];
  uploadedBy?: string;
}

export interface AuditLog {
  id: string;
  recordId: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
  timestamp: string;
  source: string;
}

export interface ReconciliationSummary {
  totalRecords: number;
  matched: number;
  unmatched: number;
  duplicates: number;
  partial: number;
  accuracy: number;
}

export interface MappingField {
  systemField: string;
  uploadedField: string;
  required: boolean;
}
