import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '@domain/models/user.model';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';

@Injectable({ providedIn: 'root' })
export class EditarClienteUseCase {
  constructor(private repository: UsuarioRepository) {}

  execute(usuario: Usuario): Observable<Usuario> {
    return this.repository.editar(usuario);
  }
}
