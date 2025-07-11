import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';
import { AppRoutes } from '@core/constants/app.routes';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  constructor(
    private authSession: AuthSessionGateway,
    private router: Router
  ) {}

  execute(): void {
    this.authSession.logout();
    this.router.navigate([AppRoutes.LOGIN]);
  }
}
