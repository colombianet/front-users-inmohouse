import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { RoleGuard } from '@core/guards/role.guard';
import { UserRoles } from '@core/constants/app.roles';

export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardComponent },

  {
    path: 'admin',
    canActivate: [RoleGuard(UserRoles.ADMIN)],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'estadisticas',
        loadComponent: () =>
          import('./components/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent)
      }
    ]
  },
  {
    path: 'agente',
    canActivate: [RoleGuard(UserRoles.AGENTE)],
    loadComponent: () =>
      import('./agente/agente-dashboard.component').then(m => m.AgenteDashboardComponent)
  },
  {
    path: 'cliente',
    canActivate: [RoleGuard(UserRoles.CLIENTE)],
    loadComponent: () =>
      import('./cliente/cliente-dashboard.component').then(m => m.ClienteDashboardComponent)
  }
];
