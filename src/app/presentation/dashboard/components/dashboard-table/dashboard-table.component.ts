import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  TemplateRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { EstadoPipe } from '@shared/pipes/estado.pipe';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    EstadoPipe,
    PrecioMonedaPipe
  ]
})
export class DashboardTableComponent<T> implements AfterViewInit {
  private _dataSource!: MatTableDataSource<T>;

  @Input()
  set dataSource(value: MatTableDataSource<T>) {
    this._dataSource = value;
    this.tryAttachPaginator();
  }

  get dataSource(): MatTableDataSource<T> {
    return this._dataSource;
  }

  @Input() title!: string;
  @Input() displayedColumns!: string[];
  @Input() columnDefs!: { key: string; label: string }[];
  @Input() emptyMessage = 'No hay datos disponibles.';
  @Input() showActions = false;
  @Input() showDelete = false;
  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  @Output() editar = new EventEmitter<T>();
  @Output() eliminar = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('defaultCell', { static: true }) defaultCell!: TemplateRef<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.tryAttachPaginator();
    this.cdr.detectChanges();
  }

  private tryAttachPaginator(): void {
    if (this._dataSource && this.paginator) {
      this._dataSource.paginator = this.paginator;
    } else {
      setTimeout(() => this.tryAttachPaginator());
    }
  }

  resolveTemplate(key: string): TemplateRef<any> {
    return this.customTemplates?.[key] ?? this.defaultCell;
  }

  onEditar(row: T): void {
    this.editar.emit(row);
  }

  onEliminar(row: T): void {
    this.eliminar.emit(row);
  }
}
