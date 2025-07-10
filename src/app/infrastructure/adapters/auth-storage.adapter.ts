import { Injectable } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';

@Injectable({ providedIn: 'root' })
export class AuthStorageAdapter implements AuthSessionGateway {
  constructor(private auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }

  getToken(): string | null {
    return this.auth.getToken();
  }

  getUserPayload(): any | null {
    return this.auth.getUserPayload();
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  getRoles(): string[] {
    return this.auth.getRoles();
  }

  getEmail(): string | null {
    return this.auth.getEmail();
  }

  getNombre(): string | null {
    return this.auth.getNombre();
  }

  esAgente(): boolean {
    return this.getRoles().includes('ROLE_AGENTE');
  }
}
