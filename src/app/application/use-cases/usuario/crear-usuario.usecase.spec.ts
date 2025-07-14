import { TestBed } from '@angular/core/testing';
import { CrearUsuarioUseCase } from './crear-usuario.usecase';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { Usuario } from '@domain/models/user.model';
import { of } from 'rxjs';

describe('CrearUsuarioUseCase', () => {
  let useCase: CrearUsuarioUseCase;
  const mockUsuario: Usuario = { id: 1, nombre: 'Demo', email: '', roles: [] };
  const mockRepository = {
    crear: jest.fn(() => of(mockUsuario))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrearUsuarioUseCase,
        { provide: UsuarioRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(CrearUsuarioUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar al método crear del repositorio con el usuario proporcionado', (done) => {
    useCase.execute(mockUsuario).subscribe((result) => {
      expect(result).toEqual(mockUsuario);
      expect(mockRepository.crear).toHaveBeenCalledWith(mockUsuario);
      done();
    });
  });
});
