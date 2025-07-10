import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadisticaAgente } from '@domain/models/estadistica.model';
import { environment } from 'environments/environment';
import { EstadisticaPorTipo } from '@domain/models/estadistica-por-tipo.model';

@Injectable({ providedIn: 'root' })
export class EstadisticasApiService {
  private readonly url = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getPropiedadesPorAgente(): Observable<EstadisticaAgente[]> {
    return this.http.get<EstadisticaAgente[]>(`${this.url}/admin/estadisticas/propiedades-por-agente`);
  }

  getEstadisticasAgenteCompleto(): Observable<EstadisticaAgente[]> {
    return this.http.get<EstadisticaAgente[]>(`${this.url}/propiedades/estadisticas/agente-completo`);
  }

  getEstadisticasPorTipo(): Observable<EstadisticaPorTipo[]> {
    return this.http.get<EstadisticaPorTipo[]>(`${this.url}/admin/estadisticas/propiedades-por-tipo`);
  }
}
