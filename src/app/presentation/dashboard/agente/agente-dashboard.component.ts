import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { AppTexts } from '@core/constants/app.texts';

import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';

import { FormatearRolesPipe } from '@shared/pipes/formatear-roles.pipe';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';

import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { MaterialModule } from '@shared/material.module';
import { AGENTE_PROVIDERS } from './agente-dashboard.providers';

import { AgenteClientesService } from './services/agente-clientes.service';
import { AgenteSyncService } from './services/agente-sync.service';

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
  public readonly sesionService = inject(SesionService);

  private readonly clienteService = inject(AgenteClientesService);
  private readonly syncService = inject(AgenteSyncService);

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
    this.isCargandoClientes = true;
    this.isCargandoPropiedades = true;

    this.syncService.sincronizar().subscribe(({ clientes, propiedades }) => {
      this.dataSourceClientes.data = clientes;
      this.propiedades = propiedades;
      this.isCargandoClientes = false;
      this.isCargandoPropiedades = false;
    });
  }

  abrirFormularioCliente(): void {
    this.clienteService.abrirFormulario(() => this.actualizarEstado());
  }

  editarCliente(cliente: Usuario): void {
    this.clienteService.editar(cliente, () => this.actualizarEstado());
  }

  eliminarCliente(id: number): void {
    this.clienteService.eliminar(id, () => this.actualizarEstado());
  }
}
