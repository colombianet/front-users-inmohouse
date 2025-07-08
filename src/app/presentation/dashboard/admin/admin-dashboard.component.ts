import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';

import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';
import { EstadoPipe } from '@shared/pipes/estado.pipe';

import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { CrearPropiedadUseCase } from '@application/use-cases/propiedad/crear-propiedad.usecase';
import { EliminarPropiedadUseCase } from '@application/use-cases/propiedad/eliminar-propiedad.usecase';

import { UserService } from '@infrastructure/services/user.service';
import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    DashboardTableComponent,
    EstadoPipe,
    PrecioMonedaPipe,
  ],
    providers: [
    ListarPropiedadesUseCase,
    CrearPropiedadUseCase,
    EliminarPropiedadUseCase,
    { provide: PropiedadRepository, useClass: PropiedadHttpService }
  ],
})
export class AdminDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  usuarios: Usuario[] = [];
  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  displayedUserColumns: string[] = ['nombre', 'email', 'roles', 'acciones'];
  dataSourcePropiedades = new MatTableDataSource<Propiedad>();
  dataSourceUsuarios = new MatTableDataSource<Usuario>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly listarPropiedades = inject(ListarPropiedadesUseCase);
  private readonly crearPropiedad = inject(CrearPropiedadUseCase);
  private readonly eliminarPropiedad = inject(EliminarPropiedadUseCase);
  private readonly userService = inject(UserService);

  esAgente = this.authService.esAgente();

  constructor() {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit(): void {
    this.refrescarListado();
    this.refrescarUsuarios();
  }

  refrescarListado(): void {
    this.listarPropiedades.execute().subscribe(propiedades => {
      this.propiedades = propiedades;
      this.dataSourcePropiedades.data = propiedades;
    });
  }

  refrescarUsuarios(): void {
    this.userService.list().subscribe(usuarios => {
      this.usuarios = this.esAgente
        ? usuarios.filter(u => this.esCliente(u))
        : usuarios;

      this.dataSourceUsuarios.data = this.usuarios;
    });
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false
    });

    dialogRef.componentInstance.propiedadCreada?.subscribe(() => {
      this.refrescarListado();
      dialogRef.close();
      this.snackBar.open('✅ Propiedad creada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-success']
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
    if (this.esAgente && !this.esCliente(usuario)) return;

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
    const usuario = this.usuarios.find(u => u.id === id);
    if (this.esAgente && usuario && !this.esCliente(usuario)) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.userService.delete(id).subscribe(() => {
          this.refrescarUsuarios();
          this.snackBar.open(AppTexts.DELETE_USER_SUCCESS, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        });
      }
    });
  }

  eliminarPropiedadDesdeTabla(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: '¿Estás seguro de eliminar esta propiedad?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eliminarPropiedad.execute(id).subscribe(() => {
          this.snackBar.open('✅ Propiedad eliminada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.refrescarListado();
        });
      }
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

  formatearRoles(roles: any[]): string {
    if (!Array.isArray(roles)) return '';
    return roles
      .map(r => {
        const valor = typeof r === 'string' ? r : r?.nombre || r?.name;
        return typeof valor === 'string' ? valor.replace('ROLE_', '') : '';
      })
      .filter(r => r)
      .join(', ');
  }

  esCliente(usuario: Usuario): boolean {
    return usuario.roles.some(r =>
      typeof r === 'string' ? r === 'ROLE_CLIENTE' : r.nombre === 'ROLE_CLIENTE'
    );
  }
}
