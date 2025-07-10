import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { AppTexts } from '@core/constants/app.texts';

import { Propiedad } from '@domain/models/propiedad.model';
import { EstadoPipe } from '@shared/pipes/estado.pipe';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';
import { DashboardTableComponent } from '../components/dashboard-table/dashboard-table.component';

import { ListarPropiedadesDisponiblesUseCase } from '@application/use-cases/propiedad/istar-propiedades-disponibles.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';

import { PropertyService } from '@infrastructure/services/property.service';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';
import { LogoutUseCase } from '@application/use-cases/logout.usecase';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    EstadoPipe,
    PrecioMonedaPipe,
    DashboardTableComponent
  ],
  providers: [
    ListarPropiedadesDisponiblesUseCase,
    LogoutUseCase,
    { provide: PropiedadRepository, useClass: PropiedadHttpService },
    { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
  ]
})
export class ClienteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_CLIENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];
  displayedColumns: string[] = ['titulo', 'tipo', 'estado', 'ubicacion', 'precio'];
  dataSource = new MatTableDataSource<Propiedad>();

  private readonly snackBar = inject(MatSnackBar);
  private readonly listarDisponibles = inject(ListarPropiedadesDisponiblesUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly authSession = inject(AuthStorageAdapter);

  constructor() {
    this.nombre = this.authSession.getNombre();
  }

  ngOnInit(): void {
    this.refrescarListado();
  }

  refrescarListado(): void {
    this.listarDisponibles.execute().subscribe({

      next: (propiedades) => {
        console.log
        this.propiedades = propiedades;
        this.dataSource.data = propiedades;
      },
      error: () => {
        this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  logout(): void {
    this.logoutUseCase.execute();
    this.snackBar.open(AppTexts.LOGOUT, 'Cerrar', {
      duration: 3000,
      panelClass: ['snack-success']
    });
  }
}
