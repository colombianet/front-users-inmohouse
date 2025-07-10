import { Injectable } from '@angular/core';
import { EstadisticaAgente } from '@domain/models/estadistica.model';
import { EstadisticasApiService } from '@infrastructure/adapters/estadisticas-api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ObtenerEstadisticasAgenteUseCase {
  constructor(private estadisticasApi: EstadisticasApiService) {}

  execute(opciones?: { incluirInactivos?: boolean }): Observable<EstadisticaAgente[]> {
    const usarCompleto = opciones?.incluirInactivos ?? false;

    return usarCompleto
      ? this.estadisticasApi.getEstadisticasAgenteCompleto()
      : this.estadisticasApi.getPropiedadesPorAgente();
  }
}
