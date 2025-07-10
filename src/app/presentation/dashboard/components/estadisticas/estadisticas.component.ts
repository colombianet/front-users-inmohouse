import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExportButtonComponent } from '@shared/export-button/export-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { EstadisticaAgente } from '@domain/models/estadistica.model';
import { ObtenerEstadisticasAgenteUseCase } from '@application/use-cases/obtener-estadisticas-agente/obtener-estadisticas-agente.usecase';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ExportButtonComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class EstadisticasComponent {
  propiedadesPorAgente: { name: string; value: number }[] = [];
  exportData: { Agente: string; Cantidad: number }[] = [];
  isLoading = true;
  colorScheme = 'vivid';

  constructor(
    private obtenerEstadisticas: ObtenerEstadisticasAgenteUseCase,
    private router: Router
  ) {
    this.obtenerEstadisticas.execute().subscribe((data: EstadisticaAgente[]) => {
      this.propiedadesPorAgente = data.map(({ agente, cantidad }) => ({
        name: agente,
        value: cantidad
      }));

      this.exportData = data.map(({ agente, cantidad }) => ({
        Agente: agente,
        Cantidad: cantidad
      }));

      this.isLoading = false;
    });
  }

  get chartHeight(): number {
    const base = 60;
    const padding = 100;
    return this.propiedadesPorAgente.length * base + padding;
  }

  volver(): void {
    this.router.navigate(['/dashboard/admin']);
  }
}
