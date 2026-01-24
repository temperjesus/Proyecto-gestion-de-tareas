import { Routes } from '@angular/router';
import { KanbanBoardComponent } from './modules/kanban/pages/kanban-board/kanban-board.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  { path: 'kanban', component: KanbanBoardComponent },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
