import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppTexts } from '@core/constants/app.texts';
import { Propiedad } from '@domain/models/propiedad.model';

import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';

import { ListarPropiedadesDisponiblesUseCase } from '@application/use-cases/propiedad/istar-propiedades-disponibles.usecase';

import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { CLIENTE_PROVIDERS } from './cliente-dashboard.providers';
import { MaterialModule } from '@shared/material.module';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  imports: [
    CommonModule,
    MaterialModule,
    TablaPropiedadesComponent
  ],
  providers: [ CLIENTE_PROVIDERS ]
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
