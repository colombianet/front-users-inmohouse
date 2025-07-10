import { Usuario } from '@domain/models/user.model';
import { Observable } from 'rxjs';

export abstract class UsuarioRepository {
  abstract listar(): Observable<Usuario[]>;
  abstract crear(usuario: Usuario): Observable<Usuario>;
  abstract editar(usuario: Usuario): Observable<Usuario>;
  abstract eliminar(id: number): Observable<void>;
  abstract listarClientes(): Observable<Usuario[]>;
}
