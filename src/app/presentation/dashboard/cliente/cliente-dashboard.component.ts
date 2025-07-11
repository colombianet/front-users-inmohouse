import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppTexts } from '@core/constants/app.texts';
import { Propiedad } from '@domain/models/propiedad.model';

import { EstadoPipe } from '@shared/pipes/estado.pipe';
import { PrecioMonedaPipe } from '@shared/pipes/precio-moneda.pipe';
import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';

import { ListarPropiedadesDisponiblesUseCase } from '@application/use-cases/propiedad/istar-propiedades-disponibles.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { PropiedadHttpService } from '@infrastructure/adapters/propiedad-http.service';

import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';
import { LogoutUseCase } from '@application/use-cases/logout.usecase';
import { SesionService } from '@application/services/sesion.service';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    EstadoPipe,
    PrecioMonedaPipe,
    TablaPropiedadesComponent
  ],
  providers: [
    ListarPropiedadesDisponiblesUseCase,
    LogoutUseCase,
    SesionService,
    { provide: PropiedadRepository, useClass: PropiedadHttpService },
    { provide: AuthSessionGateway, useClass: AuthStorageAdapter }
  ]
})
export class ClienteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_CLIENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];

  private readonly snackBar = inject(MatSnackBar);
  private readonly listarDisponibles = inject(ListarPropiedadesDisponiblesUseCase);
  private readonly authSession = inject(AuthStorageAdapter);
  public readonly sesionService = inject(SesionService);

  constructor() {
    this.nombre = this.authSession.getNombre();
  }

  ngOnInit(): void {
    this.refrescarListado();
  }

  refrescarListado(): void {
    this.listarDisponibles.execute().subscribe({
      next: propiedades => {
        this.propiedades = propiedades;
      },
      error: () => {
        this.snackBar.open(AppTexts.ERROR_CHARGE_PROPERTYS, 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}
