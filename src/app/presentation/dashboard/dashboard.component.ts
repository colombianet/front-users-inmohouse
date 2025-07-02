import { Component, inject, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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

      const role = decoded.role || decoded.roles?.[0];

      const routeMap: Record<string, string> = {
        ROLE_ADMIN: '/dashboard/admin',
        ROLE_AGENTE: '/dashboard/agente',
        ROLE_CLIENTE: '/dashboard/cliente'
      };

      const targetRoute = routeMap[role] || '/login';
      this.router.navigate([targetRoute]);
    }
  }
}
