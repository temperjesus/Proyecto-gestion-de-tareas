import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type KanbanStatus = 'COMPLETED' | 'IN_REVIEW' | 'CANCELLED' | 'OVERDUE';

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
  status: KanbanStatus;
  tasks: KanbanTask[];
};

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
})
export class KanbanBoardComponent {
  constructor(private router: Router) {}

  title = 'Project Kanban Board';
  subtitle = 'Gestión de proyectos y tareas operativas para PYMES';

  filters = {
    members: 'All Members',
    team: 'Marketing Team',
    lead: 'Lead Devs',
    deadline: 'Deadline: This Week',
  };

  columns: KanbanColumn[] = [
    {
      title: 'COMPLETADA',
      badge: 3,
      accent: 'green',
      status: 'COMPLETED',
      tasks: [
        { id: 1, title: 'Optimización SEO Landing Page', dateText: 'Oct 12, 2023', progressPct: 100, subtasksLabel: '8/8 Subtasks' },
      ],
    },
    {
      title: 'POR REVISIÓN',
      badge: 2,
      accent: 'yellow',
      status: 'IN_REVIEW',
      tasks: [
        { id: 2, title: 'Implementación pasarela de pagos', dateText: 'Oct 24, 2023', progressPct: 85, subtasksLabel: '12/14 Subtasks', chiefOnly: true },
        { id: 3, title: 'Ajuste de diseño móvil Dashboard', dateText: 'Oct 26, 2023', progressPct: 60, subtasksLabel: '3/5 Subtasks' },
      ],
    },
    {
      title: 'CANCELADA',
      badge: 1,
      accent: 'gray',
      status: 'CANCELLED',
      tasks: [
        { id: 4, title: 'Integración con API Antigua', dateText: 'Sep 30, 2023', progressPct: 10, subtasksLabel: '—' },
      ],
    },
    {
      title: 'RETRASADA',
      badge: 1,
      accent: 'red',
      status: 'OVERDUE',
      tasks: [
        { id: 5, title: 'Cierre Contable Mes Anterior', dateText: 'Venció: Oct 15', progressPct: 40, subtasksLabel: '2/5 Subtasks', overdueText: 'Venció' },
      ],
    },
  ];

  accentColor(accent: KanbanColumn['accent']) {
    switch (accent) {
      case 'green': return '#22c55e';
      case 'yellow': return '#f59e0b';
      case 'gray': return '#94a3b8';
      case 'red': return '#ef4444';
    }
  }

  openTask(taskId: number) {
    this.router.navigate(['/tasks/details', taskId]);
  }
}
