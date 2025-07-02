import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;

  constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
  ) {
    this.nombre = this.authService.getNombre();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([AppRoutes.LOGIN]);
    this.snackBar.open('Sesión finalizada', 'Cerrar', {
      duration: 3000,
      panelClass: 'snack-success'
    });
  }
}
