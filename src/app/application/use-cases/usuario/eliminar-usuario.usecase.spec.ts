import { TestBed } from '@angular/core/testing';
import { EliminarUsuarioUseCase } from './eliminar-usuario.usecase';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { of } from 'rxjs';

describe('EliminarUsuarioUseCase', () => {
  let useCase: EliminarUsuarioUseCase;
  const mockRepository = {
    eliminar: jest.fn(() => of(undefined))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EliminarUsuarioUseCase,
        { provide: UsuarioRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(EliminarUsuarioUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar al método eliminar del repositorio con el id proporcionado', (done) => {
    useCase.execute(42).subscribe(() => {
      expect(mockRepository.eliminar).toHaveBeenCalledWith(42);
      done();
    });
  });
});
