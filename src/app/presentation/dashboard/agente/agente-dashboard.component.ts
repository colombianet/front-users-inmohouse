import { Component } from '@angular/core';
import { AppTexts } from '@core/constants/app.texts';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  templateUrl: './agente-dashboard.component.html',
  styleUrls: ['./agente-dashboard.component.scss']
})
export class AgenteDashboardComponent {
  title = AppTexts.WELCOME_AGENTE;
  nombre: string | null;

  constructor(private authService: AuthService) {
    this.nombre = this.authService.getNombre();
  }
}
