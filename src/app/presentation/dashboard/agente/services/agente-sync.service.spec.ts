import { TestBed } from '@angular/core/testing';
import { AgenteSyncService } from './agente-sync.service';
import { ListarClientesUseCase } from '@application/use-cases/usuario/listar-clientes.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { of } from 'rxjs';

describe('AgenteSyncService', () => {
  let service: AgenteSyncService;

  const mockClientes = [{ id: 1, nombre: 'Cliente Uno' }];
  const mockPropiedades = [{ id: 10, titulo: 'Casa Uno' }];

  const mockListarClientesUseCase = {
    execute: jest.fn(() => of(mockClientes))
  };

  const mockListarPropiedadesUseCase = {
    execute: jest.fn(() => of(mockPropiedades))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgenteSyncService,
        { provide: ListarClientesUseCase, useValue: mockListarClientesUseCase },
        { provide: ListarPropiedadesUseCase, useValue: mockListarPropiedadesUseCase }
      ]
    });

    service = TestBed.inject(AgenteSyncService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería sincronizar y retornar clientes y propiedades', (done) => {
    service.sincronizar().subscribe(result => {
      expect(result.clientes).toEqual(mockClientes);
      expect(result.propiedades).toEqual(mockPropiedades);
      expect(mockListarClientesUseCase.execute).toHaveBeenCalled();
      expect(mockListarPropiedadesUseCase.execute).toHaveBeenCalled();
      done();
    });
  });
});
