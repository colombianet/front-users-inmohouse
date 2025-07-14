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
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';
import { AgenteResumenComponent } from '../components/agente-resumen/agente-resumen.component';

import { FormatearRolesPipe } from '@shared/pipes/formatear-roles.pipe';
import { MaterialModule } from '@shared/material.module';

import { EliminarPropiedadUseCase } from '@application/use-cases/propiedad/eliminar-propiedad.usecase';

import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { ADMIN_PROVIDERS } from './admin-dashboard.providers';

import { AdminPropiedadService } from './services/admin-propiedad.service';
import { AdminUsuarioService } from './services/admin-usuario.service';
import { AdminResumenService } from './services/admin-resumen.service';

import { esCliente } from './utils/roles.utils';
import { AdminSyncService } from './services/admin-sync.service';

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
    FormatearRolesPipe,
    AgenteResumenComponent
  ],
  providers: ADMIN_PROVIDERS
})
export class AdminDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_ADMIN;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  usuarios: Usuario[] = [];
  resumenAgentes: { agente: string; cantidad: number }[] = [];

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

  private readonly eliminarPropiedad = inject(EliminarPropiedadUseCase);

  private readonly propiedadService = inject(AdminPropiedadService);
  private readonly usuarioService = inject(AdminUsuarioService);
  private readonly resumenService = inject(AdminResumenService);
  private readonly syncService = inject(AdminSyncService);

  esAgente = this.authSession.esAgente();

  constructor() {
    this.nombre = this.authSession.getNombre();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.isGlobalLoading = true;
      if (event instanceof NavigationEnd) this.isGlobalLoading = false;
    });
  }

  ngOnInit(): void {
    this.actualizarEstado();
  }

  private actualizarEstado(): void {
    this.isCargandoPropiedades = true;
    this.isCargandoUsuarios = true;

    this.syncService.sincronizar().subscribe(({ usuarios, propiedades }) => {
      this.usuarios = this.esAgente ? usuarios.filter(esCliente) : usuarios;
      this.dataSourceUsuarios.data = this.usuarios;

      this.propiedades = propiedades;
      this.resumenAgentes = this.resumenService.generarResumen(this.usuarios, this.propiedades);

      this.isCargandoPropiedades = false;
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
      this.actualizarEstado();
      dialogRef.close();
      this.snackBar.open('✅ Propiedad creada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-success']
      });
    });
  }

  abrirFormularioUsuario(): void {
    this.usuarioService.abrirFormularioUsuario(() => this.actualizarEstado());
  }

  editarUsuario(usuario: Usuario): void {
    const puedeEditar = !(this.esAgente && !esCliente(usuario));
    this.usuarioService.editarUsuario(usuario, puedeEditar, () => this.actualizarEstado());
  }

  eliminarUsuario(id: number): void {
    const usuario = this.usuarios.find(u => u.id === id);
    const puedeEliminar = !(this.esAgente && usuario && !esCliente(usuario));
    if (usuario) {
      this.usuarioService.confirmarEliminarUsuario(usuario, puedeEliminar, () => this.actualizarEstado());
    }
  }

  eliminarPropiedadDesdeTabla(id: number): void {
    this.propiedadService.eliminarPropiedad(id, this.eliminarPropiedad.execute.bind(this.eliminarPropiedad), () => {
      this.actualizarEstado();
    });
  }

  editarPropiedad(propiedad: Propiedad): void {
    this.propiedadService.abrirFormularioEdicion(propiedad, () => this.actualizarEstado());
  }

  asignarPropiedadDesdeTabla(propiedad: Propiedad): void {
    this.propiedadService.abrirAsignarDialog(propiedad, () => this.actualizarEstado());
  }

  desasignarPropiedad(propiedad: Propiedad): void {
    this.propiedadService.desasignarConConfirmacion(propiedad, () => this.actualizarEstado());
  }
}
