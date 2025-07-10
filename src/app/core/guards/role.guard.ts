import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRoutes } from '@core/constants/app.routes';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { ValidarSesionUseCase } from '@application/use-cases/validar-sesion.usecase';

export const RoleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authAdapter = inject(AuthStorageAdapter);
    const validarSesion = new ValidarSesionUseCase(authAdapter);

    const isLoggedIn = validarSesion.execute();
    const userRoles = authAdapter.getRoles();

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
