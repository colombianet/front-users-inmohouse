import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface Propiedad {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  precio: number;
  ubicacion: string;
  estado: string;
  agenteId?: number;
  clienteId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) { }

  create(propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(`${this.baseUrl}/propiedades`, propiedad);
  }

  list(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/propiedades`);
  }

  // 🔍 Propiedades creadas por el agente autenticado
  listByAgente(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/agente/mis-propiedades`);
  }

  // Propiedades en estado disponible
  listDisponibles(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(`${this.baseUrl}/cliente/disponibles`);
  }

  update(id: number, propiedad: Propiedad): Observable<Propiedad> {
    return this.http.put<Propiedad>(`${this.baseUrl}/propiedades/${id}`, propiedad);
  }

}
