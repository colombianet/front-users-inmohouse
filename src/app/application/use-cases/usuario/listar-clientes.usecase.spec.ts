import { TestBed } from '@angular/core/testing';
import { ListarClientesUseCase } from './listar-clientes.usecase';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { of } from 'rxjs';

describe('ListarClientesUseCase', () => {
  let useCase: ListarClientesUseCase;
  const mockClientes = [{ id: 1, nombre: 'Cliente Demo', email: '', roles: ['CLIENTE'] }];
  const mockRepository = {
    listarClientes: jest.fn(() => of(mockClientes))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ListarClientesUseCase,
        { provide: UsuarioRepository, useValue: mockRepository }
      ]
    });

    useCase = TestBed.inject(ListarClientesUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería devolver la lista de clientes desde el repositorio', (done) => {
    useCase.execute().subscribe((result) => {
      expect(result).toEqual(mockClientes);
      expect(mockRepository.listarClientes).toHaveBeenCalled();
      done();
    });
  });
});
