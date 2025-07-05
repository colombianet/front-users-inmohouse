import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';

import { PropertyService } from '@infrastructure/services/property.service';
import { UserService } from '@infrastructure/services/user.service';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';

import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

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
    MatCardModule,
    MatPaginatorModule,
    RouterModule
  ]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  usuarios: Usuario[] = [];

  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  displayedUserColumns: string[] = ['nombre', 'email', 'roles', 'acciones'];

  dataSourcePropiedades = new MatTableDataSource<Propiedad>();
  dataSourceUsuarios = new MatTableDataSource<Usuario>();

  @ViewChild('paginatorPropiedades', { static: true }) paginatorPropiedades!: MatPaginator;
  @ViewChild('paginatorUsuarios', { static: true }) paginatorUsuarios!: MatPaginator;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private propertyService: PropertyService,
    private userService: UserService
  ) {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit() {
    this.refrescarListado();
    this.refrescarUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSourcePropiedades.paginator = this.paginatorPropiedades;
    this.dataSourceUsuarios.paginator = this.paginatorUsuarios;
  }

  refrescarListado() {
    this.propertyService.list().subscribe(propiedades => {
      this.propiedades = propiedades as Propiedad[];
      this.dataSourcePropiedades.data = propiedades as Propiedad[];
    });
  }

  refrescarUsuarios(): void {
    this.userService.list().subscribe(usuarios => {
      this.usuarios = usuarios;
      this.dataSourceUsuarios.data = usuarios;
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

      this.snackBar.open('✅ Propiedad creada correctamente', 'Cerrar', {
        duration: 3000
      });
    });
  }

  abrirFormularioUsuario(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { modo: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refrescarUsuarios();
      }
    });
  }

  editarUsuario(usuario: Usuario): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refrescarUsuarios();
      }
    });
  }

  eliminarUsuario(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.userService.delete(id).subscribe(() => {
          this.refrescarUsuarios();
          this.snackBar.open(AppTexts.DELETE_USER_SUCCESS, 'Cerrar', {
            duration: 3000
          });
        });
      }
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

  formatearRoles(roles: any[]): string {
    if (!Array.isArray(roles)) return '';

    return roles
      .map(r => {
        const valor = typeof r === 'string' ? r : r?.name;
        return typeof valor === 'string' ? valor.replace('ROLE_', '') : '';
      })
      .filter(r => r)
      .join(', ');
  }
}
