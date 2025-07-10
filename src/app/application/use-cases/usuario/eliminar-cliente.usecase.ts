import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';

@Injectable({ providedIn: 'root' })
export class EliminarClienteUseCase {
  constructor(private repository: UsuarioRepository) {}

  execute(id: number): Observable<void> {
    return this.repository.eliminar(id);
  }
}
