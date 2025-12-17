export interface Task {
  id: string;
  title: string;
  source: 'Classroom' | 'Calendar' | 'Manual';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface DocumentFile {
  name: string;
  content: string;
  lastModified: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  TASKS = 'TASKS',
  WORKSPACE = 'WORKSPACE',
  MAIL = 'MAIL'
}