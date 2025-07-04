import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AppRoutes } from '@core/constants/app.routes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  constructor(private router: Router) {}

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserPayload(): any | null {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  getRoles(): string[] {
    const payload = this.getUserPayload();
    return Array.isArray(payload?.roles) ? payload.roles : [];
  }

  getRole(): string | null {
    return this.getRoles()?.[0] || null;
  }

  getNombre(): string | null {
    return this.getUserPayload()?.nombre || null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  redireccionarPorRol(): void {
    const roles = this.getRoles().map(r => r.replace('ROLE_', ''));
    const rutaPorRol: Record<string, string> = {
      ADMIN: AppRoutes.ADMIN,
      AGENTE: AppRoutes.AGENTE,
      CLIENTE: AppRoutes.CLIENTE
    };

    const prioridad = ['ADMIN', 'AGENTE', 'CLIENTE'];
    const rolPrincipal = prioridad.find(r => roles.includes(r));

    if (rolPrincipal) {
      this.router.navigate([rutaPorRol[rolPrincipal]]);
    } else {
      this.router.navigate([AppRoutes.UNAUTHORIZED]);
    }
  }

  // ✅ Métodos de ayuda para roles
  esAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }

  esAgente(): boolean {
    return this.getRoles().includes('ROLE_AGENTE');
  }

  esCliente(): boolean {
    return this.getRoles().includes('ROLE_CLIENTE');
  }
}
