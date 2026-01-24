import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Kpi = { title: string; value: string; delta: string; deltaType: 'positive' | 'negative' };
type TaskCard = {
  tag: string;
  title: string;
  dueText: string;
  progressPct: number;
  subtasksLabel?: string;
  statusNote?: string;
  statusType?: 'success' | 'muted';
};
type AlertItem = { title: string; body: string };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  userName = 'Juan Pérez';
  weeklyProgressPct = 85;
  evidenceDueToday = 3;

  kpis: Kpi[] = [
    { title: 'Tareas Completadas', value: '12', delta: '+15% esta semana', deltaType: 'positive' },
    { title: 'Pendientes Hoy', value: '3', delta: '-2 desde ayer', deltaType: 'negative' },
    { title: 'Horas Registradas', value: '34h', delta: '+2% del objetivo', deltaType: 'positive' },
  ];

  tasks: TaskCard[] = [
    {
      tag: 'PRIORIDAD ALTA',
      title: 'Reporte de Ventas Mensual - SMB Solutions',
      dueText: 'Vence en 2 horas',
      progressPct: 75,
      subtasksLabel: '3/4 Subtareas',
    },
    {
      tag: 'PENDIENTE REVISIÓN JEFE',
      title: 'Auditoría de Inventario - Bodega Norte',
      dueText: 'Vence mañana',
      progressPct: 100,
      statusNote: 'Evidencia enviada. Esperando aprobación.',
      statusType: 'success',
    },
  ];

  alerts: AlertItem[] = [
    { title: 'Nueva Tarea Asignada', body: '"Hola Juan, se te ha asignado..."' },
    { title: 'Aprobación Recibida', body: '"Evidencia aprobada..."' },
    { title: 'Recordatorio de Vencimiento', body: '"Quedan 2 horas..."' },
  ];
}
