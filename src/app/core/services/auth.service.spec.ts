import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '@core/constants/app.routes';
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockRouter = { navigate: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería establecer y obtener el token', () => {
    service.setToken('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('debería eliminar el token en logout', () => {
    localStorage.setItem('token', 'abc');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('debería retornar null si no hay token', () => {
    expect(service.getUserPayload()).toBeNull();
  });

  it('debería decodificar el payload del token', () => {
    localStorage.setItem('token', 'abc');
    const mockPayload = { id: 5, nombre: 'Demo', email: 'demo@mail.com', roles: ['ROLE_ADMIN'] };
    (jwtDecode as jest.Mock).mockReturnValue(mockPayload);
    expect(service.getUserPayload()).toEqual(mockPayload);
  });

  it('debería validar si está autenticado según el exp', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 1000;
    (jwtDecode as jest.Mock).mockReturnValue({ exp: futureExp });
    localStorage.setItem('token', 'abc');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('debería retornar false si exp está expirado', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 1000;
    (jwtDecode as jest.Mock).mockReturnValue({ exp: pastExp });
    localStorage.setItem('token', 'abc');
    expect(service.isAuthenticated()).toBe(false);
  });

  it('debería retornar id, nombre y email desde el payload', () => {
    const payload = { id: 1, nombre: 'Oscar', email: 'oscar@mail.com' };
    (jwtDecode as jest.Mock).mockReturnValue(payload);
    localStorage.setItem('token', 'abc');

    expect(service.getId()).toBe(1);
    expect(service.getNombre()).toBe('Oscar');
    expect(service.getEmail()).toBe('oscar@mail.com');
  });

  it('debería retornar roles y verificar existencia', () => {
    const payload = { roles: ['ROLE_ADMIN', 'ROLE_CLIENTE'] };
    (jwtDecode as jest.Mock).mockReturnValue(payload);
    localStorage.setItem('token', 'abc');

    expect(service.getRoles()).toEqual(['ROLE_ADMIN', 'ROLE_CLIENTE']);
    expect(service.hasRole('ROLE_CLIENTE')).toBe(true);
    expect(service.hasRole('ROLE_AGENTE')).toBe(false);
    expect(service.getRole()).toBe('ROLE_ADMIN');
  });

  it('debería identificar si es admin, agente o cliente', () => {
    (jwtDecode as jest.Mock).mockReturnValue({ roles: ['ROLE_CLIENTE'] });
    localStorage.setItem('token', 'abc');
    expect(service.esCliente()).toBe(true);
    expect(service.esAgente()).toBe(false);
    expect(service.esAdmin()).toBe(false);
  });

  it('debería redirigir según rol con prioridad', () => {
    (jwtDecode as jest.Mock).mockReturnValue({ roles: ['ROLE_CLIENTE', 'ROLE_ADMIN'] });
    localStorage.setItem('token', 'abc');
    service.redireccionarPorRol();
    expect(mockRouter.navigate).toHaveBeenCalledWith([AppRoutes.ADMIN]);
  });

  it('debería redirigir a UNAUTHORIZED si no hay roles válidos', () => {
    (jwtDecode as jest.Mock).mockReturnValue({ roles: [] });
    localStorage.setItem('token', 'abc');
    service.redireccionarPorRol();
    expect(mockRouter.navigate).toHaveBeenCalledWith([AppRoutes.UNAUTHORIZED]);
  });
});
