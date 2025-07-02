import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AppTexts } from '@core/constants/app.texts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;

  constructor(private authService: AuthService) {
    this.nombre = this.authService.getNombre();
  }
}
