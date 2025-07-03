import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { PropertyService } from '@infrastructure/services/property.service';
import { Propiedad } from '@domain/models/propiedad.model';
import { PropertyFormComponent } from '../components/property-form/property-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule
  ]
})
export class AdminDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private propertyService: PropertyService,
  ) {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit() {
    this.refrescarListado();
  }

  refrescarListado() {
    this.propertyService.list().subscribe(propiedades => {
      this.propiedades = propiedades;
    });
  }

  abrirFormulario() {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.componentInstance.propiedadCreada.subscribe(() => {
      this.refrescarListado();
      dialogRef.close();

      this.snackBar.open('✅ Propiedad creada correctamente', 'Cerrar', {
        duration: 3000
      });
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate([AppRoutes.LOGIN]);
    this.snackBar.open('Sesión finalizada', 'Cerrar', {
      duration: 3000,
      panelClass: 'snack-success'
    });
  }
}
