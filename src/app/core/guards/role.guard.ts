import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AppRoutes } from '@core/constants/app.routes';

export const RoleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const isLoggedIn = auth.isAuthenticated();
    const userRoles = auth.getRoles();

    if (!isLoggedIn) {
      router.navigate([AppRoutes.LOGIN]);
      return false;
    }

    const hasRole = userRoles.includes(requiredRole);

    if (!hasRole) {
      router.navigate([AppRoutes.UNAUTHORIZED]);
      return false;
    }

    return true;
  };
};
