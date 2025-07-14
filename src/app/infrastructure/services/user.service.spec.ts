import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';
import { Usuario } from '@domain/models/user.model';

describe('UserService', () => {
  let service: UserService;

  const mockHttp = {
    get: jest.fn(() => of([])),
    post: jest.fn(() => of({})),
    put: jest.fn(() => of({})),
    delete: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(UserService);
    jest.clearAllMocks();
  });

  const baseUrl = `${environment.apiBaseUrl}/users`;

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a list()', () => {
    service.list().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(baseUrl);
  });

  it('debería llamar a listClientes()', () => {
    service.listClientes().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${baseUrl}/clientes`);
  });

  it('debería llamar a listarPorAgente()', () => {
    service.listarPorAgente(99).subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${baseUrl}?agenteId=99`);
  });

  it('debería crear usuario', () => {
    const usuario: Usuario = { id: 1, nombre: 'Nuevo', email: '', roles: [] };
    service.create(usuario).subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(baseUrl, usuario);
  });

  it('debería editar usuario', () => {
    const usuario: Usuario = { id: 5, nombre: 'Editado', email: '', roles: [] };
    service.update(5, usuario).subscribe();
    expect(mockHttp.put).toHaveBeenCalledWith(`${baseUrl}/5`, usuario);
  });

  it('debería eliminar usuario', () => {
    service.delete(7).subscribe();
    expect(mockHttp.delete).toHaveBeenCalledWith(`${baseUrl}/7`);
  });

  it('debería obtener usuario por id', () => {
    service.getById(8).subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${baseUrl}/8`);
  });
});
