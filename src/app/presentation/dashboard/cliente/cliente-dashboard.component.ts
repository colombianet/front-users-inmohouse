import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';
import { AuthService } from '@core/services/auth.service';
import { PropertyService } from '@infrastructure/services/property.service';
import { Propiedad } from '@domain/models/propiedad.model';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    DashboardTableComponent
  ]
})
export class ClienteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_CLIENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  dataSource = new MatTableDataSource<Propiedad>();
  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private propertyService: PropertyService
  ) {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit(): void {
    this.propertyService.listDisponibles().subscribe({
      next: (res) => {
        this.propiedades = res;
        this.dataSource.data = this.propiedades;
      },
      error: () => this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS_AVAILABLES, 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-error']
      })
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([AppRoutes.LOGIN]);
    this.snackBar.open(AppTexts.LOGOUT, 'Cerrar', {
      duration: 3000,
      panelClass: ['snack-success']
    });
  }
}
