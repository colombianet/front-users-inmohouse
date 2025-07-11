import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExportButtonComponent } from '@shared/export-button/export-button.component';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

import { EstadisticaAgente } from '@domain/models/estadistica.model';
import { EstadisticaPorTipo } from '@domain/models/estadistica-por-tipo.model';
import { ObtenerEstadisticasAgenteUseCase } from '@application/use-cases/estadisticas/obtener-estadisticas-agente.usecase copy';
import { ObtenerEstadisticasPorTipoUseCase } from '@application/use-cases/estadisticas/obtener-estadisticas-por-tipo.usecase';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class EstadisticasComponent implements OnDestroy {
  propiedadesPorAgente: { name: string; value: number }[] = [];
  propiedadesPorTipo: { name: string; value: number }[] = [];
  exportData: { Categoria: string; Cantidad: number }[] = [];
  isLoading = true;
  colorScheme = 'vivid';
  mostrarInactivos = false;
  vista: 'agente' | 'tipo' = 'agente';

  private destroy$ = new Subject<void>();

  colorPorTipo: { [tipo: string]: string } = {
    CASA: '#4CAF50',
    APARTAMENTO: '#2196F3',
    LOCAL: '#FF9800',
    BODEGA: '#9C27B0',
    OFICINA: '#00BCD4',
    LOTE: '#795548'
  };

  constructor(
    private obtenerEstadisticasAgente: ObtenerEstadisticasAgenteUseCase,
    private obtenerEstadisticasTipo: ObtenerEstadisticasPorTipoUseCase,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading = true;

    if (this.vista === 'agente') {
      this.obtenerEstadisticasAgente.execute({ incluirInactivos: this.mostrarInactivos })
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: EstadisticaAgente[]) => {
          this.propiedadesPorAgente = data.map(({ agente, cantidad }) => ({
            name: cantidad === 0 ? `${agente} ⚠` : agente,
            value: cantidad
          }));

          this.exportData = data.map(({ agente, cantidad }) => ({
            Categoria: agente,
            Cantidad: cantidad
          }));

          this.isLoading = false;
          this.cdr.detectChanges();
        });
    } else {
      this.obtenerEstadisticasTipo.execute()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: EstadisticaPorTipo[]) => {
          this.propiedadesPorTipo = data.map(({ tipo, cantidad }) => ({
            name: tipo?.toUpperCase() || 'DESCONOCIDO',
            value: cantidad
          }));

          this.exportData = data.map(({ tipo, cantidad }) => ({
            Categoria: tipo || 'Desconocido',
            Cantidad: cantidad
          }));

          this.isLoading = false;
          this.cdr.detectChanges();
        });
    }
  }

  calcularTotal(): number {
    return this.exportData.reduce((acc, item) => acc + item.Cantidad, 0);
  }

  formatearPorcentaje = (value: number): string => {
    const total = this.calcularTotal();
    const porcentaje = total > 0 ? (value / total * 100).toFixed(1) : '0';
    return `${value} • ${porcentaje}%`;
  };

  cambiarVista(nueva: 'agente' | 'tipo'): void {
    if (this.vista !== nueva) {
      this.vista = nueva;
      this.cargarEstadisticas();
    }
  }

  toggleInactivos(): void {
    this.mostrarInactivos = !this.mostrarInactivos;
    if (this.vista === 'agente') this.cargarEstadisticas();
  }

  get chartHeight(): number {
    const base = 60;
    const padding = 100;
    const total = this.vista === 'agente'
      ? this.propiedadesPorAgente?.length || 0
      : this.propiedadesPorTipo?.length || 0;

    return Math.min(total * base + padding, 1000);
  }

  get coloresTipo(): { name: string; value: string }[] {
    return this.propiedadesPorTipo.map(({ name }) => {
      const tipo = name?.split(' ')[0]?.toUpperCase() || 'DESCONOCIDO';
      return { name, value: this.colorPorTipo[tipo] || '#607D8B' };
    });
  }

  volver(): void {
    this.router.navigate(['/dashboard/admin']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
