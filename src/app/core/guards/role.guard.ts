import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';

export const RoleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const isLoggedIn = auth.isAuthenticated();
    const roles = auth.getRoles();
    const isAuthorized = isLoggedIn && roles.includes(requiredRole);

    if (!isAuthorized) {
      router.navigate([AppRoutes.UNAUTHORIZED]);
      return false;
    }

    return true;
  };
};
