import { TestBed } from '@angular/core/testing';
import { UsuarioHttpService } from './usuario-http.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('UsuarioHttpService', () => {
  let service: UsuarioHttpService;
  const mockHttp = {
    get: jest.fn(() => of([])),
    post: jest.fn(() => of({})),
    put: jest.fn(() => of({})),
    delete: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsuarioHttpService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(UsuarioHttpService);
    jest.clearAllMocks();
  });

  const base = `${environment.apiBaseUrl}/users`;

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a listar()', () => {
    service.listar().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(base);
  });

  it('debería listar clientes', () => {
    service.listarClientes().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${base}/clientes`);
  });

  it('debería crear un usuario', () => {
    const usuario = { nombre: 'Nuevo' };
    service.crear(usuario as any).subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(base, usuario);
  });

  it('debería editar un usuario', () => {
    const usuario = { id: 5, nombre: 'Editado' };
    service.editar(usuario as any).subscribe();
    expect(mockHttp.put).toHaveBeenCalledWith(`${base}/5`, usuario);
  });

  it('debería eliminar un usuario por id', () => {
    service.eliminar(9).subscribe();
    expect(mockHttp.delete).toHaveBeenCalledWith(`${base}/9`);
  });

  it('getAll debería llamar a listar()', () => {
    service.getAll().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(base);
  });

  it('debería obtener usuarios por rol', () => {
    service.getPorRol('ADMIN').subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${base}/por-rol/ADMIN`);
  });
});
