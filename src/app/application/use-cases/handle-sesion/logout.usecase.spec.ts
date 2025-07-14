import { TestBed } from '@angular/core/testing';
import { LogoutUseCase } from './logout.usecase';
import { AuthSessionGateway } from '@domain/gateways/auth-session.gateway';
import { Router } from '@angular/router';
import { AppRoutes } from '@core/constants/app.routes';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  const mockAuthSession = { logout: jest.fn() };
  const mockRouter = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogoutUseCase,
        { provide: AuthSessionGateway, useValue: mockAuthSession },
        { provide: Router, useValue: mockRouter }
      ]
    });

    useCase = TestBed.inject(LogoutUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar a logout() y redirigir al login', () => {
    useCase.execute();

    expect(mockAuthSession.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith([AppRoutes.LOGIN]);
  });
});
