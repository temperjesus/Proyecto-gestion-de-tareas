import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

// ✅ IMPORT CORRECTO EN TU ESTRUCTURA (4 ../)
import { TaskStoreService, StoredTask, Status } from '../../../../core/services/task-store.service';

type KanbanTask = {
  id: number;
  title: string;
  dateText: string;
  progressPct: number;
  subtasksLabel: string;
  chiefOnly?: boolean;
  overdueText?: string;
};

type KanbanColumn = {
  title: string;
  badge: number;
  accent: 'green' | 'yellow' | 'gray' | 'red';
  status: Status;
  tasks: KanbanTask[];
};

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent {
  constructor(private router: Router, private store: TaskStoreService) {}

  title = 'Project Kanban Board';
  subtitle = 'Gestión de proyectos y tareas operativas para PYMES';

  filters = {
    members: 'All Members',
    team: 'Marketing Team',
    lead: 'Lead Devs',
    deadline: 'Deadline: This Week',
  };

  columns: KanbanColumn[] = [];

  ngOnInit() {
    this.buildColumns();
  }

  // Si vienes de Create Task y se actualizó el store, al entrar al Kanban ya lo verás.
  private buildColumns() {
    const all = this.store.getAll();

    this.columns = [
      this.makeColumn('COMPLETADA', 'green', 'COMPLETED', all),
      this.makeColumn('POR REVISIÓN', 'yellow', 'IN_REVIEW', all),
      this.makeColumn('CANCELADA', 'gray', 'CANCELLED', all),
      this.makeColumn('RETRASADA', 'red', 'OVERDUE', all),
    ];
  }

  private makeColumn(title: string, accent: KanbanColumn['accent'], status: Status, all: StoredTask[]): KanbanColumn {
    const tasks = all
      .filter(t => t.status === status)
      .map(t => this.mapToKanban(t));

    return {
      title,
      accent,
      status,
      badge: tasks.length,
      tasks,
    };
  }

  private mapToKanban(t: StoredTask): KanbanTask {
    return {
      id: t.id,
      title: t.title,
      dateText: t.dateText,
      progressPct: t.progressPct,
      subtasksLabel: t.subtasksLabel,
      overdueText: t.status === 'OVERDUE' ? 'Venció' : undefined,
      chiefOnly: t.status === 'IN_REVIEW',
    };
  }

  openTask(taskId: number) {
    this.router.navigate(['/tasks/details', taskId]);
  }

  accentColor(accent: KanbanColumn['accent']) {
    switch (accent) {
      case 'green': return '#22c55e';
      case 'yellow': return '#f59e0b';
      case 'gray': return '#94a3b8';
      case 'red': return '#ef4444';
    }
  }
}
