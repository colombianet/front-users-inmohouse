import { TestBed } from '@angular/core/testing';
import { AuthStorageAdapter } from './auth-storage.adapter';
import { AuthService } from '@core/services/auth.service';

describe('AuthStorageAdapter', () => {
  let adapter: AuthStorageAdapter;
  const mockAuthService = {
    logout: jest.fn(),
    getToken: jest.fn(() => 'abc'),
    getUserPayload: jest.fn(() => ({ nombre: 'Oscar', email: 'demo@mail.com' })),
    isAuthenticated: jest.fn(() => true),
    getRoles: jest.fn(() => ['ROLE_AGENTE']),
    getEmail: jest.fn(() => 'demo@mail.com'),
    getNombre: jest.fn(() => 'Oscar')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStorageAdapter,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    adapter = TestBed.inject(AuthStorageAdapter);
    jest.clearAllMocks();
  });

  it('debería crear el adaptador', () => {
    expect(adapter).toBeTruthy();
  });

  it('debería ejecutar logout desde AuthService', () => {
    adapter.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('debería retornar token, usuario y datos básicos', () => {
    expect(adapter.getToken()).toBe('abc');
    expect(adapter.getUserPayload()).toEqual({ nombre: 'Oscar', email: 'demo@mail.com' });
    expect(adapter.getEmail()).toBe('demo@mail.com');
    expect(adapter.getNombre()).toBe('Oscar');
  });

  it('debería retornar los roles y validar si es agente', () => {
    expect(adapter.getRoles()).toEqual(['ROLE_AGENTE']);
    expect(adapter.esAgente()).toBe(true);
  });

  it('debería verificar si está autenticado', () => {
    expect(adapter.isAuthenticated()).toBe(true);
  });
});
