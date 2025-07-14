import { TestBed } from '@angular/core/testing';
import { EditarUsuarioUseCase } from './editar-usuario.usecase';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { Usuario } from '@domain/models/user.model';
import { of } from 'rxjs';

describe('EditarUsuarioUseCase', () => {
  let useCase: EditarUsuarioUseCase;
  const mockUsuario: Usuario = { id: 1, nombre: 'Demo', email: '', roles: [] };
  const mockRepository = {
    editar: jest.fn(() => of(mockUsuario))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditarUsuarioUseCase,
        { provide: UsuarioRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(EditarUsuarioUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar al método editar del repositorio con el usuario proporcionado', (done) => {
    useCase.execute(mockUsuario).subscribe((result) => {
      expect(result).toEqual(mockUsuario);
      expect(mockRepository.editar).toHaveBeenCalledWith(mockUsuario);
      done();
    });
  });
});
