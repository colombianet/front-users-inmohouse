import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';

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

  getRole(): string | null {
    const payload = this.getUserPayload();
    return payload?.roles?.[0] || null;
  }

  getNombre(): string | null {
    return this.getUserPayload()?.nombre || null;
  }


  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
