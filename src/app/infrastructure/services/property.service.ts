import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

export interface Propiedad {
  id?: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  precio: number;
  ubicacion: string;
  estado: string;
  agenteId: number;
  clienteId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly url = `${environment.apiBaseUrl}/propiedades`;

  constructor(private http: HttpClient) {}

  create(propiedad: Propiedad) {
    return this.http.post<Propiedad>(this.url, propiedad);
  }

  list() {
    return this.http.get<Propiedad[]>(this.url);
  }
}
