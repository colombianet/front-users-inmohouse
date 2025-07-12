import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EstadoPipe } from '@shared/pipes/estado.pipe';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';
import { Propiedad } from '@domain/models/propiedad.model';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tabla-propiedades',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    EstadoPipe,
    PrecioMonedaPipe
  ],
  templateUrl: './tabla-propiedades.component.html',
  styleUrls: ['./tabla-propiedades.component.scss']
})
export class TablaPropiedadesComponent implements AfterViewInit {
  @Input() propiedades: Propiedad[] = [];
  @Input() mostrarAcciones = false;
  @Input() emptyMessage = 'No hay propiedades disponibles.';
  @Input() pageSize = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Output() editar = new EventEmitter<Propiedad>();
  @Output() eliminar = new EventEmitter<Propiedad>();
  @Output() asignar = new EventEmitter<Propiedad>();
  @Output() desasignar = new EventEmitter<Propiedad>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  columnas: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  dataSource = new MatTableDataSource<Propiedad>();

  get columnasFinal(): string[] {
    return this.mostrarAcciones ? [...this.columnas, 'acciones'] : this.columnas;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    this.dataSource.data = this.propiedades || [];
  }

  asignarAgenteDesdeTabla(propiedad: Propiedad): void {
    console.log('Propiedad a asignar:', propiedad);
    this.asignar.emit(propiedad);
  }

  desasignarAgenteDesdeTabla(propiedad: Propiedad): void {
    this.desasignar.emit(propiedad);
  }
}
