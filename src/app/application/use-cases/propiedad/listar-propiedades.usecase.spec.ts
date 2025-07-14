import { TestBed } from '@angular/core/testing';
import { ListarPropiedadesUseCase } from './listar-propiedades.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';

describe('ListarPropiedadesUseCase', () => {
  let useCase: ListarPropiedadesUseCase;
  const mockPropiedades = [{ id: 1, titulo: 'Demo' }];
  const mockRepository = {
    listar: jest.fn(() => of(mockPropiedades))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListarPropiedadesUseCase,
        { provide: PropiedadRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(ListarPropiedadesUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería devolver las propiedades desde el repositorio', (done) => {
    useCase.execute().subscribe((result) => {
      expect(result).toEqual(mockPropiedades);
      expect(mockRepository.listar).toHaveBeenCalled();
      done();
    });
  });
});
