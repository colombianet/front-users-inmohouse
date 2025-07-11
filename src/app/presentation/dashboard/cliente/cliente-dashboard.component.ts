import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppTexts } from '@core/constants/app.texts';
import { Propiedad } from '@domain/models/propiedad.model';

import { TablaPropiedadesComponent } from '../components/tabla-propiedades/tabla-propiedades.component';
import { MaterialModule } from '@shared/material.module';

import { ListarPropiedadesDisponiblesUseCase } from '@application/use-cases/propiedad/istar-propiedades-disponibles.usecase';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { CLIENTE_PROVIDERS } from './cliente-dashboard.providers';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TablaPropiedadesComponent
  ],
  providers: CLIENTE_PROVIDERS
})
export class ClienteDashboardComponent implements OnInit {
  title = AppTexts.WELCOME_CLIENTE;
  nombre: string | null;
  propiedades: Propiedad[] = [];

  isCargandoPropiedades = true;
  isGlobalLoading = false;

  private readonly listarPropiedades = inject(ListarPropiedadesDisponiblesUseCase);
  private readonly authSession = inject(AuthStorageAdapter);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
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
  }

  refrescarListado(): void {
    this.isCargandoPropiedades = true;

    this.listarPropiedades.execute().subscribe({
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
}
