import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '@core/services/estadisticas.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ExportService } from '@core/services/export.service';
import { ExportButtonComponent } from '@shared/export-button/export-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    private exportService: ExportService
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

  exportarComoExcel(): void {
    const datos = this.propiedadesPorAgente.map(item => ({
      Agente: item.name,
      Cantidad: item.value
    }));
    this.exportService.exportAsExcelFile(datos, 'propiedades_por_agente');
  }

  exportarComoPdf(): void {
    const datos = this.propiedadesPorAgente.map(item => ({
      Agente: item.name,
      Cantidad: item.value
    }));
    this.exportService.exportAsPdfFile(datos, 'propiedades_por_agente');
  }

}
