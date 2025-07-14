import { TestBed } from '@angular/core/testing';
import { CrearPropiedadUseCase } from './crear-propiedad.usecase';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';
import { Propiedad } from '@domain/models/propiedad.model';

describe('CrearPropiedadUseCase', () => {
  let useCase: CrearPropiedadUseCase;
  const mockPropiedad: Propiedad = {
    id: 1,
    titulo: 'Demo',
    descripcion: '',
    tipo: '',
    precio: 0,
    ubicacion: '',
    estado: ''
  };
  const mockRepository = {
    crear: jest.fn(() => of(mockPropiedad))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrearPropiedadUseCase,
        { provide: PropiedadRepository, useValue: mockRepository }
      ]
    });
    useCase = TestBed.inject(CrearPropiedadUseCase);
  });

  it('debería crear el caso de uso', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería llamar al método crear del repositorio con la propiedad proporcionada', (done) => {
    useCase.execute(mockPropiedad).subscribe((result) => {
      expect(result).toEqual(mockPropiedad);
      expect(mockRepository.crear).toHaveBeenCalledWith(mockPropiedad);
      done();
    });
  });
});
