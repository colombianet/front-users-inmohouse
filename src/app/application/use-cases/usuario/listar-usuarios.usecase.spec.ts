import { TestBed } from '@angular/core/testing';
import { ListarUsuariosUseCase } from './listar-usuarios.usecase';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { of } from 'rxjs';

describe('ListarUsuariosUseCase', () => {
  let useCase: ListarUsuariosUseCase;
  const mockUsuarios = [{ id: 1, nombre: 'Admin', email: '', roles: ['ADMIN'] }];
  const mockRepository = {
    listar: jest.fn(() => of(mockUsuarios))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListarUsuariosUseCase,
        { provide: UsuarioRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(ListarUsuariosUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería devolver la lista de usuarios desde el repositorio', (done) => {
    useCase.execute().subscribe((result) => {
      expect(result).toEqual(mockUsuarios);
      expect(mockRepository.listar).toHaveBeenCalled();
      done();
    });
  });
});
