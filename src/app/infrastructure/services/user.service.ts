import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '@domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly url = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  list(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }

  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  update(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  listClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/clientes`);
  }

  listarPorAgente(idAgente: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}?agenteId=${idAgente}`);
  }
}
