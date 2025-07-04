import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';
import { PropertyService } from '@infrastructure/services/property.service';
import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { Propiedad } from '@domain/models/propiedad.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  templateUrl: './agente-dashboard.component.html',
  styleUrls: ['./agente-dashboard.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule
  ]
})
export class AgenteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_AGENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private propertyService: PropertyService,
    private dialog: MatDialog
  ) {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit(): void {
    this.refrescarListado();
  }

  refrescarListado(): void {
    this.propertyService.listByAgente().subscribe({
      next: (res) => this.propiedades = res as Propiedad[],
      error: () => this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
        duration: 3000,
        panelClass: 'snack-error'
      })
    });
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.componentInstance.propiedadCreada.subscribe(() => {
      this.refrescarListado();
      dialogRef.close();
      this.snackBar.open(AppTexts.CONFORM_CREATE_PROPERTY, 'Cerrar', {
        duration: 3000
      });
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([AppRoutes.LOGIN]);
    this.snackBar.open(AppTexts.LOGOUT, 'Cerrar', {
      duration: 3000,
      panelClass: 'snack-success'
    });
  }
}
