import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '@domain/models/user.model';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioHttpService implements UsuarioRepository {
  private readonly baseUrl = `${environment.apiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  listarClientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/por-rol/ROLE_CLIENTE`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  editar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${usuario.id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<Usuario[]> {
    return this.listar();
  }

  getPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/por-rol/${rol}`);
  }
}
