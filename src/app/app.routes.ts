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
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('@presentation/errors/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('@presentation/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
