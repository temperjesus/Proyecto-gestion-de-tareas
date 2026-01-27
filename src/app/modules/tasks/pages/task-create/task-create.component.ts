import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskStoreService, Priority, Status, StoredSubtask } from '../../../../core/services/task-store.service';




type SubtaskForm = {
  title: string;
  assignedTo: string;
  deadline: string;
  status: Status;
  whatsappNotify: boolean;
};

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
})
export class TaskCreateComponent {
  constructor(private store: TaskStoreService, private router: Router) {}

  pageTitle = 'Create New Project Task';
  pageSub = 'Define la tarea y crea sus subtareas desde aquí.';

  task = {
    project: 'Fintech App Revamp',
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    chiefReviewer: 'Jefe Administrativo',
    startDate: '',
    deadline: '',
    whatsappNotify: true,
  };

  projects = ['Fintech App Revamp', 'SMB Growth', 'Finance Ops', 'Legacy Migration'];
  chiefs = ['Jefe Administrativo', 'Alejandro Gomez', 'Carlos Rodriguez'];
  members = ['Juan Pérez', 'Daniela R.', 'Carlos M.', 'Elena V.', 'Valentina M.'];

  subtasks: SubtaskForm[] = [
    { title: 'Definir alcance', assignedTo: 'Juan Pérez', deadline: '', status: 'IN_PROGRESS', whatsappNotify: true },
    { title: 'Diseñar UI inicial', assignedTo: 'Daniela R.', deadline: '', status: 'IN_PROGRESS', whatsappNotify: true },
  ];

  addSubtask() {
    this.subtasks.push({
      title: '',
      assignedTo: this.members[0],
      deadline: '',
      status: 'IN_PROGRESS',
      whatsappNotify: this.task.whatsappNotify,
    });
  }

  removeSubtask(i: number) {
    if (this.subtasks.length <= 1) return;
    this.subtasks.splice(i, 1);
  }

  get completedSubtasks() {
    return this.subtasks.filter(s => s.status === 'COMPLETED').length;
  }

  get progressPct() {
    const total = this.subtasks.length || 0;
    if (!total) return 0;
    return Math.round((this.completedSubtasks / total) * 100);
  }

  submit() {
    // Validaciones mínimas para demo
    if (!this.task.title.trim()) {
      alert('Pon un título a la tarea.');
      return;
    }
    if (!this.subtasks.length) {
      alert('Debes crear al menos 1 subtarea.');
      return;
    }

    const subtasks: StoredSubtask[] = this.subtasks.map(s => ({
      title: s.title?.trim() || '(Sin título)',
      assignedTo: s.assignedTo,
      deadline: s.deadline,
      status: s.status,
      whatsappNotify: s.whatsappNotify,
    }));

    const created = this.store.addTask({
      project: this.task.project,
      title: this.task.title,
      description: this.task.description,
      priority: this.task.priority,
      chiefReviewer: this.task.chiefReviewer,
      startDate: this.task.startDate,
      deadline: this.task.deadline,
      whatsappNotify: this.task.whatsappNotify,
      subtasks,
    });

    // Redirigir al kanban para ver la tarjeta creada
    this.router.navigate(['/kanban']);

    // Opcional: navegar directo al detalle recién creado
    // this.router.navigate(['/tasks/details', created.id]);
  }
}
