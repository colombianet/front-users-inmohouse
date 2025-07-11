import { Injectable } from '@angular/core';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

@Injectable({ providedIn: 'root' })
export class ValidarSesionUseCase {
  constructor(private authGateway: AuthSessionGateway) {}

  execute(): boolean {
    return this.authGateway.isAuthenticated();
  }
}
