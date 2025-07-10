import { Injectable } from '@angular/core';
import { EstadisticaPorTipo } from '@domain/models/estadistica-por-tipo.model';
import { EstadisticasApiService } from '@infrastructure/adapters/estadisticas-api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ObtenerEstadisticasPorTipoUseCase {
  constructor(private api: EstadisticasApiService) {}

  execute(): Observable<EstadisticaPorTipo[]> {
    return this.api.getEstadisticasPorTipo();
  }
}
