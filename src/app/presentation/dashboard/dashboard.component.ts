import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutes } from '@core/constants/app.routes';
import { UserRoles } from '@core/constants/app.roles';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `<p>Redirigiendo al dashboard adecuado...</p>`
})
export class DashboardComponent implements AfterViewInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const isLoggedIn = this.authService.isAuthenticated();
      const role = this.authService.getRole();

      const routeMap: Record<string, string> = {
        [UserRoles.ADMIN]: AppRoutes.ADMIN,
        [UserRoles.AGENTE]: AppRoutes.AGENTE,
        [UserRoles.CLIENTE]: AppRoutes.CLIENTE
      };

      const targetRoute = isLoggedIn && role ? routeMap[role] ?? AppRoutes.LOGIN : AppRoutes.LOGIN;
      this.router.navigate([targetRoute]);
    }
  }
}
