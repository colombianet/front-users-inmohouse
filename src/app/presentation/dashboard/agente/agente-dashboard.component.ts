import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { AppTexts } from '@core/constants/app.texts';

import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';

import { FormatearRolesPipe } from '@shared/pipes/formatear-roles.pipe';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';

import { ListarClientesUseCase } from '@application/use-cases/usuario/listar-clientes.usecase';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';

import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { MaterialModule } from '@shared/material.module';
import { AGENTE_PROVIDERS } from './agente-dashboard.providers';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  templateUrl: './agente-dashboard.component.html',
  styleUrls: ['./agente-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormatearRolesPipe,
    TablaPropiedadesComponent,
    DashboardTableComponent
  ],
  providers: [ AGENTE_PROVIDERS ]
})
export class AgenteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_AGENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  dataSourceClientes = new MatTableDataSource<Usuario>();

  isCargandoPropiedades = true;
  isCargandoClientes = true;
  isGlobalLoading = false;

  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly authSession = inject(AuthStorageAdapter);
  private readonly router = inject(Router);
  private readonly listarClientes = inject(ListarClientesUseCase);
  private readonly listarPropiedadesUseCase = inject(ListarPropiedadesUseCase);
  private readonly eliminarUsuarioUseCase = inject(EliminarUsuarioUseCase);
  public readonly sesionService = inject(SesionService);

  constructor() {
    this.nombre = this.authSession.getNombre();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.isGlobalLoading = true;
      if (event instanceof NavigationEnd) this.isGlobalLoading = false;
    });
  }

  ngOnInit(): void {
    this.refrescarListado();
    this.refrescarClientes();
  }

  refrescarListado(): void {
    this.isCargandoPropiedades = true;

    this.listarPropiedadesUseCase.execute().subscribe({
      next: propiedades => {
        this.propiedades = propiedades;
        this.isCargandoPropiedades = false;
      },
      error: () => {
        this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
        this.isCargandoPropiedades = false;
      }
    });
  }

  refrescarClientes(): void {
    this.isCargandoClientes = true;

    this.listarClientes.execute().subscribe({
      next: clientes => {
        this.dataSourceClientes.data = clientes;
        this.isCargandoClientes = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar clientes', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
        this.isCargandoClientes = false;
      }
    });
  }

  abrirFormularioCliente(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { modo: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.refrescarClientes();
    });
  }

  editarCliente(cliente: Usuario): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario: cliente, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.refrescarClientes();
    });
  }

  eliminarCliente(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eliminarUsuarioUseCase.execute(id).subscribe(() => {
          this.refrescarClientes();
          this.snackBar.open(AppTexts.DELETE_USER_SUCCESS, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        });
      }
    });
  }
}
