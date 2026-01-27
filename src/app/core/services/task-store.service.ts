import { Injectable } from '@angular/core';

export type Status = 'COMPLETED' | 'IN_REVIEW' | 'CANCELLED' | 'OVERDUE' | 'IN_PROGRESS';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type StoredSubtask = {
  title: string;
  assignedTo: string;
  deadline: string;
  status: Status;
  whatsappNotify: boolean;
};

export type StoredTask = {
  id: number;
  project: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  startDate: string;
  deadline: string;
  chiefReviewer: string;
  whatsappNotify: boolean;
  createdAt: string;

  // Derived UI fields:
  progressPct: number;
  subtasksDone: number;
  subtasksTotal: number;
  subtasksLabel: string;
  dateText: string;

  subtasks: StoredSubtask[];
};

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  private nextId = 6;

  private tasks: StoredTask[] = [
    this.seed(1, 'Optimización SEO Landing Page', 'COMPLETED', 'HIGH', 'Oct 12, 2023', '8/8 Subtasks', 100),
    this.seed(2, 'Website UI Design Phase 1', 'IN_PROGRESS', 'HIGH', 'Oct 25, 2023', '15/20 Subtasks', 75),
    this.seed(3, 'Implementación pasarela de pagos', 'IN_REVIEW', 'MEDIUM', 'Oct 24, 2023', '12/14 Subtasks', 85),
    this.seed(4, 'Integración con API Antigua', 'CANCELLED', 'LOW', 'Sep 30, 2023', '—', 10),
    this.seed(5, 'Cierre Contable Mes Anterior', 'OVERDUE', 'HIGH', 'Venció: Oct 15', '2/5 Subtasks', 40),
  ];

  private seed(
    id: number,
    title: string,
    status: Status,
    priority: Priority,
    dateText: string,
    subtasksLabel: string,
    progressPct: number
  ): StoredTask {
    const parsed = this.parseSubtasksLabel(subtasksLabel);
    return {
      id,
      project: 'Fintech App Revamp',
      title,
      description: '',
      priority,
      status,
      startDate: '',
      deadline: '',
      chiefReviewer: 'Jefe Administrativo',
      whatsappNotify: true,
      createdAt: new Date().toISOString(),
      progressPct,
      subtasksDone: parsed.done,
      subtasksTotal: parsed.total,
      subtasksLabel,
      dateText,
      subtasks: [],
    };
  }

  getAll(): StoredTask[] {
    // Devuelve copia para evitar mutaciones raras
    return [...this.tasks].sort((a, b) => b.id - a.id);
  }

  getById(id: number): StoredTask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  addTask(input: {
    project: string;
    title: string;
    description: string;
    priority: Priority;
    chiefReviewer: string;
    startDate: string;
    deadline: string;
    whatsappNotify: boolean;
    subtasks: StoredSubtask[];
  }): StoredTask {
    const totals = this.calcProgress(input.subtasks);

    const task: StoredTask = {
      id: this.nextId++,
      project: input.project,
      title: input.title || '(Sin título)',
      description: input.description || '',
      priority: input.priority,
      status: this.deriveStatus(input.subtasks),
      startDate: input.startDate || '',
      deadline: input.deadline || '',
      chiefReviewer: input.chiefReviewer,
      whatsappNotify: input.whatsappNotify,
      createdAt: new Date().toISOString(),

      progressPct: totals.progressPct,
      subtasksDone: totals.done,
      subtasksTotal: totals.total,
      subtasksLabel: `${totals.done}/${totals.total} Subtasks`,
      dateText: input.deadline ? `Deadline: ${input.deadline}` : 'Sin deadline',

      subtasks: input.subtasks,
    };

    this.tasks.unshift(task);
    return task;
  }

  private calcProgress(subtasks: StoredSubtask[]) {
    const total = subtasks.length || 0;
    const done = subtasks.filter(s => s.status === 'COMPLETED').length;
    const progressPct = total ? Math.round((done / total) * 100) : 0;
    return { total, done, progressPct };
  }

  private deriveStatus(subtasks: StoredSubtask[]): Status {
    // Regla simple para demo:
    // - si todas completed -> COMPLETED
    // - si alguna IN_REVIEW -> IN_REVIEW
    // - si alguna OVERDUE -> OVERDUE
    // - si alguna CANCELLED y todas canceladas -> CANCELLED
    // - else -> IN_PROGRESS
    if (!subtasks.length) return 'IN_PROGRESS';

    const allCompleted = subtasks.every(s => s.status === 'COMPLETED');
    if (allCompleted) return 'COMPLETED';

    const anyOverdue = subtasks.some(s => s.status === 'OVERDUE');
    if (anyOverdue) return 'OVERDUE';

    const anyReview = subtasks.some(s => s.status === 'IN_REVIEW');
    if (anyReview) return 'IN_REVIEW';

    const allCancelled = subtasks.every(s => s.status === 'CANCELLED');
    if (allCancelled) return 'CANCELLED';

    return 'IN_PROGRESS';
  }

  private parseSubtasksLabel(label: string) {
    // "12/14 Subtasks" -> {done:12,total:14}
    const m = label.match(/(\d+)\s*\/\s*(\d+)/);
    if (!m) return { done: 0, total: 0 };
    return { done: Number(m[1]), total: Number(m[2]) };
  }
}
