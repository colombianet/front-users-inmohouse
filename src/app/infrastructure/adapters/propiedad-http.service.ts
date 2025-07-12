import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { environment } from 'environments/environment';
import { Propiedad } from '@domain/models/propiedad.model';

@Injectable({
  providedIn: 'root'
})
export class PropiedadHttpService extends PropiedadRepository {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {
    super();
  }

  listar(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/propiedades`);
  }

  crear(propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(`${this.baseUrl}/propiedades`, propiedad);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/propiedades/${id}`);
  }

  listarPropiedadesDisponibles(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/cliente/disponibles`);
  }

  asignarAgente(idPropiedad: number, idAgente: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/propiedades/${idPropiedad}/asignar-agente`, {
      agenteId: idAgente
    });
  }

  desasignarAgente(idPropiedad: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/propiedades/${idPropiedad}/desasignar-agente`, {});
  }
}
