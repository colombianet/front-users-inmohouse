import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';
import { AppTexts } from '@core/constants/app.texts';

import { PropertyService } from '@infrastructure/services/property.service';
import { UserService } from '@infrastructure/services/user.service';

import { PropertyFormComponent } from '../components/property-form/property-form.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

import { Propiedad } from '@domain/models/propiedad.model';
import { Usuario } from '@domain/models/user.model';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';
import { EstadoPipe } from '@shared/pipes/estado.pipe';

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
    MatIconModule,
    DashboardTableComponent,
    EstadoPipe,
    PrecioMonedaPipe
  ],
})
export class AgenteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_AGENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  clientes: Usuario[] = [];
  esAdmin: boolean = false;

  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  displayedClientColumns: string[] = ['nombre', 'email', 'roles'];

  dataSourceClientes = new MatTableDataSource<Usuario>();
  dataSourcePropiedades = new MatTableDataSource<Propiedad>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private propertyService: PropertyService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.nombre = this.authService.getNombre();
  }

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdmin();
    this.refrescarListado();
    this.refrescarClientes();
  }

  refrescarListado(): void {
    this.propertyService.listByAgente().subscribe({
      next: (res) => {
        this.propiedades = res as Propiedad[];
        this.dataSourcePropiedades.data = this.propiedades;
      },
      error: () => this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-error']
      })
    });
  }

  refrescarClientes(): void {
    this.userService.listClientes().subscribe(clientes => {
      this.clientes = clientes.filter(c => this.esCliente(c));
      this.dataSourceClientes.data = this.clientes;
    });
  }

  abrirFormulario(): void {
    const dialogRef = this.dialog.open(PropertyFormComponent, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false,
      data: { modo: 'crear' } // ✅ Se especifica el modo para evitar error de acceso a 'null'
    });

    dialogRef.componentInstance.propiedadCreada.subscribe(() => {
      this.refrescarListado();
      dialogRef.close();
      this.snackBar.open(AppTexts.CONFORM_CREATE_PROPERTY, 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-success']
      });
    });
  }

  abrirFormularioCliente(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { modo: 'crear' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refrescarClientes();
      }
    });
  }

  editarCliente(cliente: Usuario): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: { usuario: cliente, modo: 'editar' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refrescarClientes();
      }
    });
  }

  eliminarCliente(id?: number): void {
    if (id == null) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { mensaje: AppTexts.CONFIRM_DELETE_USER }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.userService.delete(id).subscribe(() => {
          this.refrescarClientes();
          this.snackBar.open(AppTexts.DELETE_USER_SUCCESS, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        });
      }
    });
  }

  esCliente(usuario: Usuario): boolean {
    return usuario.roles.some(r =>
      typeof r === 'string' ? r === 'ROLE_CLIENTE' : r.nombre === 'ROLE_CLIENTE'
    );
  }

  formatearRoles(roles: any[]): string {
    if (!Array.isArray(roles) || roles.length === 0) return '—';

    return roles
      .map(r => {
        const valor = typeof r === 'string' ? r : r?.nombre || r?.name;
        return typeof valor === 'string' ? valor.replace('ROLE_', '') : '';
      })
      .filter(r => r)
      .join(', ');
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
