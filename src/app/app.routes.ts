import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('@presentation/auth/auth.routes').then(m => m.LOGIN_ROUTES),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@presentation/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  }
];
