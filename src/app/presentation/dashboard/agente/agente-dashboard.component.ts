import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AppTexts } from '@core/constants/app.texts';

import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';

import { EstadoPipe } from '@shared/pipes/estado.pipe';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';

import { PropertyService } from '@infrastructure/services/property.service';
import { UsuarioHttpService } from '@infrastructure/adapters/usuario-http.service';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';

import { ListarClientesUseCase } from '@application/use-cases/usuario/listar-clientes.usecase';
import { CrearUsuarioUseCase } from '@application/use-cases/usuario/crear-usuario.usecase';
import { EditarUsuarioUseCase } from '@application/use-cases/usuario/editar-usuario.usecase';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { LogoutUseCase } from '@application/use-cases/logout.usecase';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

@Component({
  selector: 'app-agente-dashboard',
  standalone: true,
  templateUrl: './agente-dashboard.component.html',
  styleUrls: ['./agente-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    DashboardTableComponent,
    EstadoPipe,
    PrecioMonedaPipe
  ],
  providers: [
    ListarClientesUseCase,
    CrearUsuarioUseCase,
    EditarUsuarioUseCase,
    EliminarUsuarioUseCase,
    LogoutUseCase,
    { provide: UsuarioRepository, useClass: UsuarioHttpService },
    { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
  ]
})
export class AgenteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_AGENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  clientes: Usuario[] = [];

  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  displayedClientColumns: string[] = ['nombre', 'email', 'roles'];

  dataSourcePropiedades = new MatTableDataSource<Propiedad>();
  dataSourceClientes = new MatTableDataSource<Usuario>();

  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly propertyService = inject(PropertyService);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly authSession = inject(AuthStorageAdapter);

  private readonly listarClientes = inject(ListarClientesUseCase);
  private readonly crearUsuarioUseCase = inject(CrearUsuarioUseCase);
  private readonly editarUsuarioUseCase = inject(EditarUsuarioUseCase);
  private readonly eliminarUsuarioUseCase = inject(EliminarUsuarioUseCase);

  constructor() {
    this.nombre = this.authSession.getNombre();
  }

  ngOnInit(): void {
    this.refrescarListado();
    this.refrescarClientes();
  }

  refrescarListado(): void {
    this.propertyService.listByAgente().subscribe({
      next: (propiedades) => {
        this.propiedades = propiedades;
        this.dataSourcePropiedades.data = propiedades;
      },
      error: () => {
        this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  refrescarClientes(): void {
    this.listarClientes.execute().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
        this.dataSourceClientes.data = clientes;
      },
      error: () => {
        this.snackBar.open('Error al cargar clientes', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
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

  formatearRoles(roles: any[]): string {
    if (!Array.isArray(roles)) return '—';

    return roles
      .map(r => {
        const valor = typeof r === 'string' ? r : r?.nombre || r?.name;
        return typeof valor === 'string' ? valor.replace('ROLE_', '') : '';
      })
      .filter(r => r)
      .join(', ');
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.snackBar.open(AppTexts.LOGOUT, 'Cerrar', {
      duration: 3000,
      panelClass: ['snack-success']
    });
  }
}
