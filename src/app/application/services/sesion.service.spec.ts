import { TestBed } from '@angular/core/testing';
import { SesionService } from './sesion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogoutUseCase } from '@application/use-cases/handle-sesion/logout.usecase';
import { AppTexts } from '@core/constants/app.texts';

describe('SesionService', () => {
  let service: SesionService;
  const mockLogoutUseCase = { execute: jest.fn() };
  const mockSnackBar = { open: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SesionService,
        { provide: LogoutUseCase, useValue: mockLogoutUseCase },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    service = TestBed.inject(SesionService);
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería ejecutar logoutUseCase.execute y mostrar un mensaje con MatSnackBar', () => {
    service.logout();

    expect(mockLogoutUseCase.execute).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      AppTexts.LOGOUT,
      'Cerrar',
      { duration: 3000, panelClass: ['snack-success'] }
    );
  });
});
