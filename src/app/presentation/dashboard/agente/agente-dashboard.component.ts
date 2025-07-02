import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './agente-dashboard.component.html',
  styleUrls: ['./agente-dashboard.component.scss']
})
export class AgenteDashboardComponent {
  title = AppTexts.WELCOME_AGENTE;
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
