import { TestBed } from '@angular/core/testing';
import { EliminarPropiedadUseCase } from './eliminar-propiedad.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';

describe('EliminarPropiedadUseCase', () => {
  let useCase: EliminarPropiedadUseCase;
  const mockRepository = {
    eliminar: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EliminarPropiedadUseCase,
        { provide: PropiedadRepository, useValue: mockRepository }
      ]
    });
    useCase = TestBed.inject(EliminarPropiedadUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar al método eliminar con el id proporcionado', (done) => {
    useCase.execute(42).subscribe(() => {
      expect(mockRepository.eliminar).toHaveBeenCalledWith(42);
      done();
    });
  });
});
