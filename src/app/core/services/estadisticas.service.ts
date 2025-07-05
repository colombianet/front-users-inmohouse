import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly url = `${environment.apiBaseUrl}/admin/estadisticas`;

  constructor(private http: HttpClient) {}

  getPropiedadesPorTipo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/propiedades-por-tipo`);
  }

  getPropiedadesPorAgente(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/propiedades-por-agente`);
  }
}
