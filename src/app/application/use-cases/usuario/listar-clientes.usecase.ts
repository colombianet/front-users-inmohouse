import { Injectable } from '@angular/core';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { Usuario } from '@domain/models/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class ListarClientesUseCase {
  constructor(private readonly usuarioRepo: UsuarioRepository) {}

  execute(): Observable<Usuario[]> {
    return this.usuarioRepo.listarClientes();
  }
}
