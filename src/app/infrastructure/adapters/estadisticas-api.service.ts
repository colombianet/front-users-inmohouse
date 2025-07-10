import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadisticaAgente } from '@domain/models/estadistica.model';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class EstadisticasApiService {
  private readonly url = `${environment.apiBaseUrl}/admin/estadisticas`;

  constructor(private http: HttpClient) {}

  getPropiedadesPorAgente(): Observable<EstadisticaAgente[]> {
    return this.http.get<EstadisticaAgente[]>(`${this.url}/propiedades-por-agente`);
  }
}
