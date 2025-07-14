import { TestBed } from '@angular/core/testing';
import { PropertyService, Propiedad } from './property.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'environments/environment';

describe('PropertyService', () => {
  let service: PropertyService;

  const mockHttp = {
    get: jest.fn(() => of([])),
    post: jest.fn(() => of({})),
    put: jest.fn(() => of({}))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PropertyService,
        { provide: HttpClient, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(PropertyService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a list()', () => {
    service.list().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades`);
  });

  it('debería llamar a listByAgente()', () => {
    service.listByAgente().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/agente/mis-propiedades`);
  });

  it('debería llamar a listDisponibles()', () => {
    service.listDisponibles().subscribe();
    expect(mockHttp.get).toHaveBeenCalledWith(`${environment.apiBaseUrl}/cliente/disponibles`);
  });

  it('debería llamar a create() con propiedad', () => {
    const propiedad: Propiedad = {
      titulo: 'Demo',
      descripcion: '',
      tipo: '',
      precio: 1000,
      ubicacion: '',
      estado: ''
    };

    service.create(propiedad).subscribe();
    expect(mockHttp.post).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades`, propiedad);
  });

  it('debería llamar a update() con id y propiedad', () => {
    const propiedad: Propiedad = {
      id: 1,
      titulo: 'Actualizada',
      descripcion: '',
      tipo: '',
      precio: 1500,
      ubicacion: '',
      estado: ''
    };

    service.update(1, propiedad).subscribe();
    expect(mockHttp.put).toHaveBeenCalledWith(`${environment.apiBaseUrl}/propiedades/1`, propiedad);
  });
});
