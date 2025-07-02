import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'agente',
    loadComponent: () =>
      import('./agente/agente-dashboard.component').then(m => m.AgenteDashboardComponent)
  },
  {
    path: 'cliente',
    loadComponent: () =>
      import('./cliente/cliente-dashboard.component').then(m => m.ClienteDashboardComponent)
  }
];

