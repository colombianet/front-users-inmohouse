import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '@core/services/estadisticas.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExportButtonComponent } from '@shared/export-button/export-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

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
  propiedadesPorAgente: any[] = [];
  colorScheme = 'vivid';
  exportData: { Agente: string; Cantidad: number }[] = [];
  isLoading = true;

  constructor(
    private estadisticasService: EstadisticasService,
    private router: Router
  ) {
    this.estadisticasService.getPropiedadesPorAgente().subscribe(data => {
      this.propiedadesPorAgente = data.map((item: any) => ({
        name: item.agente,
        value: item.cantidad
      }));

      this.exportData = this.propiedadesPorAgente.map(p => ({
        Agente: p.name,
        Cantidad: p.value
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
