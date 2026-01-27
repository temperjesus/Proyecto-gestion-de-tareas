import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './modules/kanban/pages/kanban-board/kanban-board.component';
import { TaskDetailsComponent } from './modules/tasks/pages/task-details/task-details.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  { path: 'kanban', component: KanbanBoardComponent },

  { path: 'tasks/details/:id', component: TaskDetailsComponent },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
