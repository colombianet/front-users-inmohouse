import { TestBed } from '@angular/core/testing';
import { AdminResumenService } from './admin-resumen.service';
import { esAgente } from '../utils/roles.utils';

jest.mock('../utils/roles.utils', () => ({
  esAgente: jest.fn((u: any) => u.roles.includes('AGENTE'))
}));

describe('AdminResumenService', () => {
  let service: AdminResumenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminResumenService]
    });
    service = TestBed.inject(AdminResumenService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería generar resumen de agentes con cantidad de propiedades', () => {
    const usuarios = [
      { id: 1, nombre: 'Oscar', roles: ['AGENTE'] },
      { id: 2, nombre: 'NoAgente', roles: ['CLIENTE'] }
    ];
    const propiedades = [
      { id: 1, agente: { nombre: 'Oscar' } },
      { id: 2, agente: { nombre: 'Oscar' } },
      { id: 3 }
    ];

    const resumen = service.generarResumen(usuarios as any, propiedades as any);
    expect(resumen).toEqual([{ agente: 'Oscar', cantidad: 2 }]);
  });
});
