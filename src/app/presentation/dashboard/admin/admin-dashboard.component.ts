import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { AppTexts } from '@core/constants/app.texts';
import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';

import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';

import { FormatearRolesPipe } from '@shared/pipes/formatear-roles.pipe';

import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { EliminarPropiedadUseCase } from '@application/use-cases/propiedad/eliminar-propiedad.usecase';
import { ListarUsuariosUseCase } from '@application/use-cases/usuario/listar-usuarios.usecase';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';

import { SesionService } from '@application/services/sesion.service';
import { MaterialModule } from '@shared/material.module';
import { ADMIN_PROVIDERS } from './admin-dashboard.providers';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    DashboardTableComponent,
    TablaPropiedadesComponent,
    FormatearRolesPipe
  ],
  providers: ADMIN_PROVIDERS
})
export class AdminDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  usuarios: Usuario[] = [];

  displayedUserColumns: string[] = ['nombre', 'email', 'roles'];
  dataSourceUsuarios = new MatTableDataSource<Usuario>();

  isCargandoPropiedades = true;
  isCargandoUsuarios = true;
  isGlobalLoading = false;

  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly authSession = inject(AuthStorageAdapter);
  private readonly router = inject(Router);
  public readonly sesionService = inject(SesionService);

  private readonly listarPropiedades = inject(ListarPropiedadesUseCase);
  private readonly eliminarPropiedad = inject(EliminarPropiedadUseCase);
  private readonly listarUsuarios = inject(ListarUsuariosUseCase);
  private readonly eliminarUsuarioUseCase = inject(EliminarUsuarioUseCase);

  esAgente = this.authSession.esAgente();

  constructor() {
    this.nombre = this.authSession.getNombre();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.isGlobalLoading = true;
      if (event instanceof NavigationEnd) this.isGlobalLoading = false;
    });
  }

  ngOnInit(): void {
    this.refrescarListado();
    this.refrescarUsuarios();
  }

  refrescarListado(): void {
    this.isCargandoPropiedades = true;

    this.listarPropiedades.execute().subscribe(propiedades => {
      this.propiedades = propiedades;
      this.isCargandoPropiedades = false;
    });
  }

  refrescarUsuarios(): void {
    this.isCargandoUsuarios = true;

    this.listarUsuarios.execute().subscribe(usuarios => {
      this.usuarios = this.esAgente
        ? usuarios.filter(u => this.esCliente(u))
        : usuarios;
      this.dataSourceUsuarios.data = this.usuarios;
      this.isCargandoUsuarios = false;
    });
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: { modo: 'crear' }
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
      if (result) this.refrescarUsuarios();
    });
  }

  editarUsuario(usuario: Usuario): void {
    if (this.esAgente && !this.esCliente(usuario)) return;

    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.refrescarUsuarios();
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
        this.eliminarUsuarioUseCase.execute(id).subscribe(() => {
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

  esCliente(usuario: Usuario): boolean {
    return usuario.roles.some(r =>
      typeof r === 'string' ? r === 'ROLE_CLIENTE' : r.nombre === 'ROLE_CLIENTE'
    );
  }

  editarPropiedad(propiedad: Propiedad): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      data: { propiedad, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.refrescarListado();
    });
  }
}
