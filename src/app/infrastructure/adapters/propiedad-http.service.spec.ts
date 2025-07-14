import { TestBed } from '@angular/core/testing';
import { PropiedadHttpService } from './propiedad-http.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('PropiedadHttpService', () => {
  let service: PropiedadHttpService;
  const mockHttp = {
    get: jest.fn(() => of([])),
    post: jest.fn(() => of({})),
    delete: jest.fn(() => of(undefined)),
    put: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PropiedadHttpService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(PropiedadHttpService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a listar()', () => {
    service.listar().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades`);
  });

  it('debería llamar a crear(propiedad)', () => {
    const propiedad = { id: 1, titulo: 'Demo' };
    service.crear(propiedad as any).subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades`, propiedad);
  });

  it('debería llamar a eliminar(id)', () => {
    service.eliminar(10).subscribe();
    expect(mockHttp.delete).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades/10`);
  });

  it('debería listar propiedades disponibles', () => {
    service.listarPropiedadesDisponibles().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/cliente/disponibles`);
  });

  it('debería asignar un agente a la propiedad', () => {
    service.asignarAgente(5, 99).subscribe();
    expect(mockHttp.put).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades/5/asignar-agente`, { agenteId: 99 });
  });

  it('debería desasignar agente de la propiedad', () => {
    service.desasignarAgente(5).subscribe();
    expect(mockHttp.put).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades/5/desasignar-agente`, {});
  });
});
