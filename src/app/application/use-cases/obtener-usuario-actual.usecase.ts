import { Injectable } from '@angular/core';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

@Injectable({ providedIn: 'root' })
export class ObtenerUsuarioActualUseCase {
  constructor(private authSession: AuthSessionGateway) {}

  execute(): { nombre: string | null; email: string | null; roles: string[] } {
    return {
      nombre: this.authSession.getNombre(),
      email: this.authSession.getEmail(),
      roles: this.authSession.getRoles()
    };
  }
}
