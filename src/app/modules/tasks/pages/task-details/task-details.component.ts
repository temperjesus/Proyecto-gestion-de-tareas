import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

type SubtaskStatus = 'COMPLETED' | 'IN_PROGRESS' | 'IN_REVIEW';
type WhatsAppState = 'sent' | 'pending';

type Subtask = {
  name: string;
  status: SubtaskStatus;
  responsible: string;
  whatsapp: WhatsAppState;
};

type EvidenceItem =
  | { type: 'comment'; user: string; time: string; message: string; thumbs?: string[] }
  | { type: 'file'; user: string; time: string; fileName: string; fileType: 'PDF' | 'IMG'; sizeText: string };

type ActivityItem = { message: string; time: string };

type TaskDetailsModel = {
  breadcrumbs: string[];
  title: string;
  statusLabel: string;
  dateText: string;
  priorityText: string;
  progressPct: number;
  progressMeta: string;
  info: { project: string; chiefReviewer: string; region: string; timeLogged: string };
  subtasks: Subtask[];
  evidence: EvidenceItem[];
  activity: ActivityItem[];
};

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent {
  taskId = 0;

  // === View state (binds) ===
  breadcrumbs: string[] = [];
  title = '';
  statusLabel = '';
  dateText = '';
  priorityText = '';
  progressPct = 0;
  progressMeta = '';

  info = { project: '', chiefReviewer: '', region: '', timeLogged: '' };
  subtasks: Subtask[] = [];
  evidence: EvidenceItem[] = [];
  activity: ActivityItem[] = [];

  // === Mock "DB" by taskId ===
  private mock: Record<number, TaskDetailsModel> = {
    1: {
      breadcrumbs: ['Projects', 'Marketing', 'Optimización SEO'],
      title: 'Optimización SEO Landing Page',
      statusLabel: 'COMPLETED',
      dateText: 'Oct 12, 2023',
      priorityText: 'High Priority',
      progressPct: 100,
      progressMeta: '8 of 8 subtasks completed',
      info: {
        project: 'SMB Growth',
        chiefReviewer: 'Carlos Rodriguez',
        region: 'Barranquilla, CO',
        timeLogged: '12h 40m',
      },
      subtasks: [
        { name: 'Keyword Research', status: 'COMPLETED', responsible: 'Juan P.', whatsapp: 'sent' },
        { name: 'On-page Optimization', status: 'COMPLETED', responsible: 'Valentina M.', whatsapp: 'sent' },
        { name: 'Meta Tags Audit', status: 'COMPLETED', responsible: 'Juan P.', whatsapp: 'sent' },
      ],
      evidence: [
        { type: 'comment', user: 'Juan P.', time: 'Today, 9:10 AM', message: 'SEO checklist completed. All critical issues fixed.' },
        { type: 'file', user: 'Valentina M.', time: 'Today, 9:30 AM', fileName: 'SEO_Report_Final.pdf', fileType: 'PDF', sizeText: '1.8 MB • PDF Document' },
      ],
      activity: [
        { message: 'Task marked as COMPLETED', time: '1 hour ago' },
        { message: 'SEO_Report_Final.pdf uploaded', time: '2 hours ago' },
      ],
    },

    2: {
      breadcrumbs: ['Projects', 'Client Onboarding', 'Website UI Design Phase 1'],
      title: 'Website UI Design Phase 1',
      statusLabel: 'IN PROGRESS',
      dateText: 'Oct 25, 2023',
      priorityText: 'High Priority',
      progressPct: 75,
      progressMeta: '15 of 20 subtasks completed',
      info: {
        project: 'Fintech App Revamp',
        chiefReviewer: 'Alejandro Gomez',
        region: 'Bogotá, CO',
        timeLogged: '32h 15m',
      },
      subtasks: [
        { name: 'Moodboard Definition', status: 'COMPLETED', responsible: 'Daniela R.', whatsapp: 'sent' },
        { name: 'Typography Selection', status: 'IN_PROGRESS', responsible: 'Carlos M.', whatsapp: 'pending' },
        { name: 'Color Palette Design', status: 'IN_REVIEW', responsible: 'Elena V.', whatsapp: 'sent' },
      ],
      evidence: [
        {
          type: 'comment',
          user: 'Daniela R.',
          time: 'Today, 11:30 AM',
          message: 'Initial moodboard options for review. Inspired by tech minimalism.',
          thumbs: ['thumb', 'thumb'],
        },
        {
          type: 'file',
          user: 'Elena V.',
          time: 'Yesterday, 4:45 PM',
          fileName: 'Typography_Guidelines_v2.pdf',
          fileType: 'PDF',
          sizeText: '2.4 MB • PDF Document',
        },
        {
          type: 'comment',
          user: 'Alejandro G. (Chief)',
          time: 'Yesterday, 5:15 PM',
          message: 'Looks solid. Please focus on accessibility for the typography choices. Check contrast ratios for the primary blue.',
        },
      ],
      activity: [
        { message: 'System automatically sent WhatsApp notification to Elena V.', time: '10 minutes ago' },
        { message: 'Alejandro G. changed status of "Moodboard Definition" to COMPLETED', time: '2 hours ago' },
        { message: 'Daniela R. uploaded 3 new evidence files', time: '3 hours ago' },
      ],
    },

    3: {
      breadcrumbs: ['Projects', 'Payments', 'Pasarela'],
      title: 'Implementación pasarela de pagos',
      statusLabel: 'IN REVIEW',
      dateText: 'Oct 24, 2023',
      priorityText: 'Medium Priority',
      progressPct: 85,
      progressMeta: '12 of 14 subtasks completed',
      info: {
        project: 'Fintech App Revamp',
        chiefReviewer: 'Jefe Administrativo',
        region: 'Bogotá, CO',
        timeLogged: '18h 05m',
      },
      subtasks: [
        { name: 'API Keys Setup', status: 'COMPLETED', responsible: 'Carlos M.', whatsapp: 'sent' },
        { name: 'Webhook Validation', status: 'IN_REVIEW', responsible: 'Elena V.', whatsapp: 'sent' },
        { name: 'Sandbox Tests', status: 'IN_PROGRESS', responsible: 'Carlos M.', whatsapp: 'pending' },
      ],
      evidence: [
        { type: 'comment', user: 'Carlos M.', time: 'Today, 2:10 PM', message: 'Webhook events received correctly in sandbox.' },
        { type: 'file', user: 'Elena V.', time: 'Today, 3:05 PM', fileName: 'Gateway_Test_Evidence.pdf', fileType: 'PDF', sizeText: '1.1 MB • PDF Document' },
      ],
      activity: [
        { message: 'Task moved to IN REVIEW', time: '30 minutes ago' },
        { message: 'Gateway_Test_Evidence.pdf uploaded', time: '1 hour ago' },
      ],
    },

    4: {
      breadcrumbs: ['Projects', 'Legacy', 'Integraciones'],
      title: 'Integración con API Antigua',
      statusLabel: 'CANCELLED',
      dateText: 'Sep 30, 2023',
      priorityText: 'Low Priority',
      progressPct: 10,
      progressMeta: '1 of 10 subtasks completed',
      info: {
        project: 'Legacy Migration',
        chiefReviewer: 'Carlos Rodriguez',
        region: 'Bogotá, CO',
        timeLogged: '3h 20m',
      },
      subtasks: [
        { name: 'Review old endpoints', status: 'COMPLETED', responsible: 'Juan P.', whatsapp: 'sent' },
        { name: 'Security assessment', status: 'IN_PROGRESS', responsible: 'Juan P.', whatsapp: 'pending' },
      ],
      evidence: [
        { type: 'comment', user: 'Carlos Rodriguez', time: 'Yesterday, 6:10 PM', message: 'Task cancelled due to deprecation of the legacy system.' },
      ],
      activity: [
        { message: 'Task marked as CANCELLED', time: 'Yesterday, 6:15 PM' },
      ],
    },

    5: {
      breadcrumbs: ['Projects', 'Finanzas', 'Cierre'],
      title: 'Cierre Contable Mes Anterior',
      statusLabel: 'OVERDUE',
      dateText: 'Venció: Oct 15',
      priorityText: 'High Priority',
      progressPct: 40,
      progressMeta: '2 of 5 subtasks completed',
      info: {
        project: 'Finance Ops',
        chiefReviewer: 'Jefe Administrativo',
        region: 'Bogotá, CO',
        timeLogged: '6h 10m',
      },
      subtasks: [
        { name: 'Consolidate invoices', status: 'COMPLETED', responsible: 'Juan P.', whatsapp: 'sent' },
        { name: 'Bank reconciliation', status: 'IN_PROGRESS', responsible: 'Juan P.', whatsapp: 'pending' },
        { name: 'Monthly report', status: 'IN_REVIEW', responsible: 'Carlos M.', whatsapp: 'sent' },
      ],
      evidence: [
        { type: 'comment', user: 'Juan P.', time: 'Today, 8:40 AM', message: 'Reconciling accounts. Pending confirmation from bank statement.' },
      ],
      activity: [
        { message: 'Task is OVERDUE', time: '2 days ago' },
        { message: 'WhatsApp reminder sent', time: '1 day ago' },
      ],
    },
  };

  constructor(private route: ActivatedRoute) {
    // initial load
    this.loadFromRoute();

    // if you click multiple cards, id changes without full reload
    this.route.paramMap.subscribe(() => this.loadFromRoute());
  }

  private loadFromRoute() {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? 0);
    this.taskId = id;

    const data = this.mock[id] ?? this.fallback(id);
    this.apply(data);
  }

  private apply(m: TaskDetailsModel) {
    this.breadcrumbs = m.breadcrumbs;
    this.title = m.title;
    this.statusLabel = m.statusLabel;
    this.dateText = m.dateText;
    this.priorityText = m.priorityText;
    this.progressPct = m.progressPct;
    this.progressMeta = m.progressMeta;

    this.info = m.info;
    this.subtasks = m.subtasks;
    this.evidence = m.evidence;
    this.activity = m.activity;
  }

  private fallback(id: number): TaskDetailsModel {
    return {
      breadcrumbs: ['Projects', 'Unknown', `Task #${id}`],
      title: `Task #${id}`,
      statusLabel: 'IN PROGRESS',
      dateText: '—',
      priorityText: 'Medium Priority',
      progressPct: 0,
      progressMeta: '0 of 0 subtasks completed',
      info: { project: '—', chiefReviewer: '—', region: '—', timeLogged: '—' },
      subtasks: [],
      evidence: [
        { type: 'comment', user: 'System', time: 'Now', message: 'No mock data found for this taskId. Add it in the mock DB.' },
      ],
      activity: [],
    };
  }

  statusPillClass(status: SubtaskStatus) {
    if (status === 'COMPLETED') return 'pill pill-green';
    if (status === 'IN_REVIEW') return 'pill pill-yellow';
    return 'pill pill-blue';
  }

  statusText(status: SubtaskStatus) {
    if (status === 'COMPLETED') return 'COMPLETED';
    if (status === 'IN_REVIEW') return 'REVIEWING';
    return 'IN PROGRESS';
  }
}
