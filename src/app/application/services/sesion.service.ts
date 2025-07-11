import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogoutUseCase } from '@application/use-cases/handle-sesion/logout.usecase';
import { AppTexts } from '@core/constants/app.texts';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly snackBar = inject(MatSnackBar);

  logout(): void {
    this.logoutUseCase.execute();
    this.snackBar.open(AppTexts.LOGOUT, 'Cerrar', {
      duration: 3000,
      panelClass: ['snack-success']
    });
  }
}
