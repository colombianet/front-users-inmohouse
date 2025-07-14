import { TestBed } from '@angular/core/testing';
import { ListarPropiedadesDisponiblesUseCase } from './istar-propiedades-disponibles.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';

describe('ListarPropiedadesDisponiblesUseCase', () => {
  let useCase: ListarPropiedadesDisponiblesUseCase;
  const mockPropiedades = [{ id: 1, titulo: 'Demo' }];
  const mockRepository = {
    listarPropiedadesDisponibles: jest.fn(() => of(mockPropiedades))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListarPropiedadesDisponiblesUseCase,
        { provide: PropiedadRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(ListarPropiedadesDisponiblesUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería devolver las propiedades disponibles desde el repositorio', (done) => {
    useCase.execute().subscribe((result) => {
      expect(result).toEqual(mockPropiedades);
      expect(mockRepository.listarPropiedadesDisponibles).toHaveBeenCalled();
      done();
    });
  });
});
