import { Component, inject, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutes } from '@core/constants/app.routes';
import { UserRoles } from '@core/constants/app.roles';


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
  private router = inject(Router);

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const decoded: any = jwtDecode(token);

      const role = decoded.roles?.[0];

      const routeMap: Record<string, string> = {
        [UserRoles.ADMIN]: AppRoutes.ADMIN,
        [UserRoles.ASESOR]: AppRoutes.ASESOR,
        [UserRoles.CLIENTE]: AppRoutes.CLIENTE
      };

      const targetRoute = routeMap[role] || '/login';
      this.router.navigate([targetRoute]);
    }
  }
}
