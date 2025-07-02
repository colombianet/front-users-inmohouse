import { Component } from '@angular/core';
import { AppTexts } from '@core/constants/app.texts';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss']
})
export class ClienteDashboardComponent {
  title = AppTexts.WELCOME_CLIENTE;
  nombre: string | null;

  constructor(private authService: AuthService) {
    this.nombre = this.authService.getNombre();
  }
}
