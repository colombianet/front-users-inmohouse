import { TestBed } from '@angular/core/testing';
import { AdminSyncService } from './admin-sync.service';
import { ListarUsuariosUseCase } from '@application/use-cases/usuario/listar-usuarios.usecase';
import { ListarPropiedadesUseCase } from '@application/use-cases/propiedad/listar-propiedades.usecase';
import { of } from 'rxjs';

describe('AdminSyncService', () => {
  let service: AdminSyncService;

  const mockUsuarios = [{ id: 1, nombre: 'User' }];
  const mockPropiedades = [{ id: 10, titulo: 'Casa' }];

  const mockUsuariosUseCase = {
    execute: jest.fn(() => of(mockUsuarios))
  };

  const mockPropiedadesUseCase = {
    execute: jest.fn(() => of(mockPropiedades))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminSyncService,
        { provide: ListarUsuariosUseCase, useValue: mockUsuariosUseCase },
        { provide: ListarPropiedadesUseCase, useValue: mockPropiedadesUseCase }
      ]
    });

    service = TestBed.inject(AdminSyncService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería sincronizar y retornar usuarios y propiedades', (done) => {
    service.sincronizar().subscribe(result => {
      expect(result.usuarios).toEqual(mockUsuarios);
      expect(result.propiedades).toEqual(mockPropiedades);
      expect(mockUsuariosUseCase.execute).toHaveBeenCalled();
      expect(mockPropiedadesUseCase.execute).toHaveBeenCalled();
      done();
    });
  });
});
